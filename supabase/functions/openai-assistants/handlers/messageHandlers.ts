
import { corsHeaders } from "../constants.ts";
import { TRIAGE_ASSISTANT_ID, RESEARCH_ASSISTANT_ID } from "../constants.ts";
import { getOpenAIClient, createNoApiKeyResponse } from "./threadHandlers.ts";
import { AssistantResponse, ErrorResponse } from "../types.ts";

// Extract JSON data from assistant message content
export function extractTripDataFromMessage(latestMessage: any): any | null {
  if (!latestMessage) return null;
  
  let tripData = null;
  const content = latestMessage.content;
  
  for (const contentItem of content) {
    if (contentItem.type === 'text') {
      const text = contentItem.text.value;
      try {
        // Look for JSON in the message using various patterns
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
  
  return tripData;
}

// Post a message to a thread and run the assistant
export async function postMessage(req: Request, message: string, threadId: string, assistantId: string = TRIAGE_ASSISTANT_ID): Promise<Response> {
  if (!threadId) {
    return new Response(
      JSON.stringify({
        error: 'Thread ID is required',
        details: 'No thread ID was provided in the request.',
        help: 'Create a thread first using the "create_thread" action.'
      } as ErrorResponse),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  if (!message) {
    return new Response(
      JSON.stringify({
        error: 'Message is required',
        details: 'No message content was provided in the request.',
        help: 'Include a "message" field in your request body.'
      } as ErrorResponse),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  const openai = getOpenAIClient();
  if (!openai) {
    return createNoApiKeyResponse();
  }
  
  console.log(`Posting message to thread ${threadId}, assistant ${assistantId}: "${message}"`);
  
  try {
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
    
    // Poll for completion
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
      return new Response(
        JSON.stringify({
          error: 'Assistant run failed',
          details: runStatus.last_error?.message || 'Unknown error',
          help: 'This could be due to an issue with the OpenAI service or your prompt.'
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (runStatus.status !== 'completed') {
      console.warn('Run did not complete in time:', runStatus);
      return new Response(
        JSON.stringify({
          error: 'Assistant run timed out',
          details: 'The operation took too long to complete.',
          help: 'Try again with a shorter prompt or check the OpenAI status page.'
        } as ErrorResponse),
        {
          status: 408,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get the latest messages
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // Extract the latest assistant message
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
    const latestMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;
    
    // Extract trip data from the message if it's in JSON format
    const tripData = extractTripDataFromMessage(latestMessage);
    
    return new Response(
      JSON.stringify({ 
        message: latestMessage,
        tripData,
        runStatus: runStatus.status
      } as AssistantResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in postMessage:', error);
    
    // Check for specific error types
    if (error.status === 404) {
      return new Response(
        JSON.stringify({
          error: 'Resource not found',
          details: `Either the thread ID (${threadId}) or assistant ID (${assistantId}) was not found.`,
          help: 'Verify both IDs or create a new thread.'
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    throw error; // Let the main error handler catch other errors
  }
}

// Handoff from triage to research assistant
export async function handoffToResearch(req: Request, threadId: string): Promise<Response> {
  if (!threadId) {
    return new Response(
      JSON.stringify({
        error: 'Thread ID is required',
        details: 'No thread ID was provided for the handoff operation.',
        help: 'Provide a valid thread ID that contains previous conversation history.'
      } as ErrorResponse),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  const openai = getOpenAIClient();
  if (!openai) {
    return createNoApiKeyResponse();
  }
  
  console.log(`Handing off thread ${threadId} to research assistant ${RESEARCH_ASSISTANT_ID}`);
  
  try {
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
      return new Response(
        JSON.stringify({
          error: 'Research assistant run failed',
          details: runStatus.last_error?.message || 'Unknown error during research processing',
          help: 'This could be due to a complex request or an issue with the research assistant.'
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (runStatus.status !== 'completed') {
      console.warn('Research run did not complete in time:', runStatus);
      return new Response(
        JSON.stringify({
          error: 'Research operation timed out',
          details: 'The research operation took too long to complete.',
          help: 'Try again with a more specific request or break it into smaller parts.'
        } as ErrorResponse),
        {
          status: 408,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get the latest messages
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // Extract the latest assistant message
    const assistantMessages = messages.data.filter(msg => msg.role === 'assistant');
    const latestMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;
    
    // Extract trip data from the message
    const tripData = extractTripDataFromMessage(latestMessage);
    
    return new Response(
      JSON.stringify({ 
        message: latestMessage,
        tripData,
        runStatus: runStatus.status
      } as AssistantResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in handoffToResearch:', error);
    
    // Check for specific error types
    if (error.status === 404) {
      return new Response(
        JSON.stringify({
          error: 'Resource not found',
          details: `Either the thread ID (${threadId}) or research assistant ID (${RESEARCH_ASSISTANT_ID}) was not found.`,
          help: 'Verify the thread ID or contact support about the research assistant configuration.'
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    throw error; // Let the main error handler catch other errors
  }
}
