
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "./utils/corsUtils.ts";
import { handleCors } from "./utils/corsUtils.ts";
import { callGeminiApi } from "./utils/apiService.ts";

// Main handler function for Edge Function requests
serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt in request body" }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          },
          status: 400 
        }
      );
    }
    
    console.log(`Processing prompt with Gemini:`, prompt);
    
    // Call the Gemini API
    const result = await callGeminiApi(prompt);
    
    // Return the structured response with thinking
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return a structured error response with detailed information
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error instanceof Error ? error.message : String(error),
        errorType: error.name || "UnknownError",
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
