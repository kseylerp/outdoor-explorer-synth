
import { corsHeaders } from "../constants.ts";
import { TRIAGE_ASSISTANT_ID, RESEARCH_ASSISTANT_ID } from "../constants.ts";
import { getOpenAIClient, createNoApiKeyResponse } from "./threadHandlers.ts";
import { AssistantResponse } from "../types.ts";

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
    throw new Error('threadId is required');
  }
  
  if (!message) {
    throw new Error('message is required');
  }
  
  const openai = getOpenAIClient();
  if (!openai) {
    return createNoApiKeyResponse();
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
}

// Handoff from triage to research assistant
export async function handoffToResearch(req: Request, threadId: string): Promise<Response> {
  if (!threadId) {
    throw new Error('threadId is required');
  }
  
  const openai = getOpenAIClient();
  if (!openai) {
    return createNoApiKeyResponse();
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
}
