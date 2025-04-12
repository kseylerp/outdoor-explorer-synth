
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./constants.ts";
import { createThread, getThread } from "./handlers/threadHandlers.ts";
import { postMessage, handoffToResearch } from "./handlers/messageHandlers.ts";
import { RequestBody, ErrorResponse } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqBody = await req.json().catch(err => {
      throw new Error(`Failed to parse request body: ${err.message}`);
    }) as RequestBody;
    
    const { action, message, threadId, assistantId } = reqBody;
    console.log(`Received request: action=${action}, threadId=${threadId || 'new'}, assistantId=${assistantId || 'default'}`);

    // Check for OpenAI API key before performing any action
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key is not configured',
          details: 'The OPENAI_API_KEY environment variable is not set in your Supabase project.',
          help: 'Please configure your OpenAI API key in the Supabase project settings under "Secrets". You can get an API key from https://platform.openai.com/api-keys.',
          code: 'missing_api_key'
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    switch (action) {
      case 'create_thread':
        return await createThread(req);
      case 'get_thread':
        return await getThread(req, threadId as string);
      case 'post_message':
        return await postMessage(req, message as string, threadId as string, assistantId);
      case 'handoff':
        return await handoffToResearch(req, threadId as string);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in assistants function:', error);
    
    // Improve error response with more detailed information
    const errorResponse: ErrorResponse = {
      error: error.message,
      details: error.toString(),
      help: null,
      status: error.status || '500',
      code: error.code || 'unknown_error'
    };
    
    // Add helpful guidance for common errors
    if (error.message.includes('API key')) {
      errorResponse.help = "Please configure your OpenAI API key in the Supabase project settings under 'Secrets'. You can get an API key from https://platform.openai.com/api-keys.";
      errorResponse.code = 'invalid_api_key';
    } else if (error.message.includes('Rate limit')) {
      errorResponse.help = "You've hit OpenAI's rate limits. Please wait a moment before trying again or consider upgrading your OpenAI plan.";
      errorResponse.code = 'rate_limit';
    } else if (error.message.includes('not found') || error.status === 404) {
      errorResponse.help = "The requested resource could not be found. This could be due to an expired thread or invalid assistant ID.";
      errorResponse.code = 'not_found';
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: parseInt(errorResponse.status) || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
