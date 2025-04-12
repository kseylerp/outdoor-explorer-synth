
import { corsHeaders } from "../constants.ts";
import OpenAI from "https://esm.sh/openai@4.26.0";
import { ErrorResponse } from "../types.ts";

// Initialize OpenAI client from env variable
export function getOpenAIClient(): OpenAI | null {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.error('OPENAI_API_KEY environment variable is not set');
    return null;
  }
  
  try {
    return new OpenAI({ apiKey: openaiApiKey });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    return null;
  }
}

// Create a new thread
export async function createThread(req: Request): Promise<Response> {
  try {
    const openai = getOpenAIClient();
    
    if (!openai) {
      return createNoApiKeyResponse();
    }
    
    const thread = await openai.beta.threads.create();
    console.log('Created new thread:', thread.id);
    
    return new Response(
      JSON.stringify({ threadId: thread.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating thread:', error);
    
    // Check for specific OpenAI API errors
    if (error.status === 401) {
      return new Response(
        JSON.stringify({
          error: 'Invalid OpenAI API key',
          details: 'The provided API key was rejected by OpenAI. Please check that it is valid and has not expired.',
          help: 'You can get a new API key from https://platform.openai.com/api-keys'
        } as ErrorResponse),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

// Get thread messages
export async function getThread(req: Request, threadId: string): Promise<Response> {
  if (!threadId) {
    throw new Error('threadId is required');
  }
  
  const openai = getOpenAIClient();
  if (!openai) {
    return createNoApiKeyResponse();
  }
  
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    
    return new Response(
      JSON.stringify({ messages: messages.data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error.status === 404) {
      return new Response(
        JSON.stringify({
          error: 'Thread not found',
          details: `The thread ID ${threadId} was not found. It may have expired or been deleted.`,
          help: 'Try creating a new thread.'
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    throw error;
  }
}

// Helper function to create a standardized response when API key is missing
export function createNoApiKeyResponse(): Response {
  return new Response(
    JSON.stringify({ 
      error: 'OpenAI API key is not configured',
      details: 'The OPENAI_API_KEY environment variable is not set in your Supabase project.',
      help: 'Please configure your OpenAI API key in the Supabase project settings under "Secrets". You can get an API key from https://platform.openai.com/api-keys.'
    } as ErrorResponse),
    {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
