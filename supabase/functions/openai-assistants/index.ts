
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
      help: null
    };
    
    // Add helpful guidance for common errors
    if (error.message.includes('API key')) {
      errorResponse.help = "Please configure your OpenAI API key in the Supabase project settings under 'Secrets'. You can get an API key from https://platform.openai.com/api-keys.";
    }
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
