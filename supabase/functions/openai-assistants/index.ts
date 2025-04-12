
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.26.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize OpenAI client
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// Assistant IDs
const TRIAGE_ASSISTANT_ID = 'asst_zHGdllTGFX5XIkPpnsKmWmX5';
const RESEARCH_ASSISTANT_ID = 'asst_Un9Ivmu0ylYCF4ToZQhsJ09S';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, message, threadId, assistantId } = await req.json();
    console.log(`Received request: action=${action}, threadId=${threadId || 'new'}, assistantId=${assistantId || 'default'}`);

    switch (action) {
      case 'create_thread':
        return await createThread(req);
      case 'get_thread':
        return await getThread(req, threadId);
      case 'post_message':
        return await postMessage(req, message, threadId, assistantId);
      case 'handoff':
        return await handoffToResearch(req, threadId);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in assistants function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString() 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Create a new thread
async function createThread(req: Request) {
  const thread = await openai.beta.threads.create();
  console.log('Created new thread:', thread.id);
  
  return new Response(
    JSON.stringify({ threadId: thread.id }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Get thread messages
async function getThread(req: Request, threadId: string) {
  if (!threadId) {
    throw new Error('threadId is required');
  }
  
  const messages = await openai.beta.threads.messages.list(threadId);
  
  return new Response(
    JSON.stringify({ messages: messages.data }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Post a message to a thread and run the assistant
async function postMessage(req: Request, message: string, threadId: string, assistantId: string = TRIAGE_ASSISTANT_ID) {
  if (!threadId) {
    throw new Error('threadId is required');
  }
  
  if (!message) {
    throw new Error('message is required');
  }
  
  console.log(`Posting message to thread ${threadId}, assistant ${assistantId}: "${message}"`);
  
  // Add the message to the thread
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  });
  
  // Run the assistant on the thread
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
  
  // Wait for the run to complete
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  
  // Poll for completion - we can implement a more sophisticated retry/timeout mechanism later
  let retries = 0;
  const maxRetries = 30; // 30 * 1s = 30s max wait time
  
  while (runStatus.status !== 'completed' && runStatus.status !== 'failed' && retries < maxRetries) {
    console.log(`Run status: ${runStatus.status}, waiting...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    retries++;
  }
  
  if (runStatus.status === 'failed') {
    console.error('Run failed:', runStatus);
    throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
  }
  
  if (runStatus.status !== 'completed') {
    console.warn('Run did not complete in time:', runStatus);
    throw new Error('Assistant run did not complete in time');
  }
  
  // Get the latest messages
  const messages = await openai.beta.threads.messages.list(threadId);
  
  // Extract the latest assistant message
  const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
  const latestMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;
  
  // Extract trip data from the message if it's in JSON format
  let tripData = null;
  if (latestMessage) {
    const content = latestMessage.content;
    for (const contentItem of content) {
      if (contentItem.type === 'text') {
        const text = contentItem.text.value;
        try {
          // Look for JSON in the message
          const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                            text.match(/```([\s\S]*?)\n```/) ||
                            text.match(/\{[\s\S]*"trip"[\s\S]*\}/);
                            
          if (jsonMatch) {
            const jsonText = jsonMatch[1] || jsonMatch[0];
            tripData = JSON.parse(jsonText);
            console.log('Extracted trip data:', tripData);
          }
        } catch (e) {
          console.warn('Failed to parse JSON from message:', e);
        }
      }
    }
  }
  
  return new Response(
    JSON.stringify({ 
      message: latestMessage,
      tripData,
      runStatus: runStatus.status
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Handoff from triage to research assistant
async function handoffToResearch(req: Request, threadId: string) {
  if (!threadId) {
    throw new Error('threadId is required');
  }
  
  console.log(`Handing off thread ${threadId} to research assistant ${RESEARCH_ASSISTANT_ID}`);
  
  // Add a system message to indicate the handoff
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: "Please handoff to the research assistant. I'd like to get detailed trip recommendations based on our conversation so far.",
  });
  
  // Run the research assistant on the thread
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: RESEARCH_ASSISTANT_ID,
  });
  
  // Wait for the run to complete
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  
  // Poll for completion
  let retries = 0;
  const maxRetries = 60; // 60 * 1s = 60s max wait time for research (it may take longer)
  
  while (runStatus.status !== 'completed' && runStatus.status !== 'failed' && retries < maxRetries) {
    console.log(`Research run status: ${runStatus.status}, waiting...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    retries++;
  }
  
  if (runStatus.status === 'failed') {
    console.error('Research run failed:', runStatus);
    throw new Error(`Research assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
  }
  
  if (runStatus.status !== 'completed') {
    console.warn('Research run did not complete in time:', runStatus);
    throw new Error('Research assistant run did not complete in time');
  }
  
  // Get the latest messages
  const messages = await openai.beta.threads.messages.list(threadId);
  
  // Extract the latest assistant message
  const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
  const latestMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;
  
  // Extract trip data from the message
  let tripData = null;
  if (latestMessage) {
    const content = latestMessage.content;
    for (const contentItem of content) {
      if (contentItem.type === 'text') {
        const text = contentItem.text.value;
        try {
          // Look for JSON in the message
          const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                            text.match(/```([\s\S]*?)\n```/) ||
                            text.match(/\{[\s\S]*"trip"[\s\S]*\}/);
                            
          if (jsonMatch) {
            const jsonText = jsonMatch[1] || jsonMatch[0];
            tripData = JSON.parse(jsonText);
            console.log('Extracted trip data from research assistant:', tripData);
          }
        } catch (e) {
          console.warn('Failed to parse JSON from research message:', e);
        }
      }
    }
  }
  
  return new Response(
    JSON.stringify({ 
      message: latestMessage,
      tripData,
      runStatus: runStatus.status
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
