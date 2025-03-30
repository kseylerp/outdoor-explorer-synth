
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the API key from environment variables
const claudeApiKey = Deno.env.get('my_api_key');
console.log("API key present:", !!claudeApiKey); // Log if API key exists without exposing the actual key

const claudeApiUrl = "https://api.anthropic.com/v1/messages";
const claudeModel = "claude-3-7-sonnet-20250219";

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Helper for Claude API requests
async function callClaudeApi(prompt: string) {
  try {
    console.log("Calling Claude API with prompt:", prompt);
    
    if (!claudeApiKey) {
      console.error("API key is not set in environment variables");
      throw new Error("API key is not set in environment variables");
    }
    
    const payload = {
      model: claudeModel,
      max_tokens: 4000, // Reduced to speed up response
      temperature: 1,
      system: "You are an outdoor activity planning assistant. Provide detailed trip options in JSON format according to the given schema.\n\nYou MUST return a JSON object with a 'trips' array containing 2 trip options. Each trip must include id, title, description, location, mapCenter, journey with route segments, and daily itinerary with activities. For coordinates, use [longitude, latitude] format in journey.segments.geometry.coordinates and journey.segments.steps.maneuver.location. Use realistic coordinates for all locations.\n\nMake sure that all required properties exist and are properly formatted.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            }
          ]
        }
      ]
    };

    try {
      console.log("Sending request to Claude API");
      const response = await fetch(claudeApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": claudeApiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Claude API error: ${response.status}`, errorText);
        return { 
          error: `Claude API error: ${response.status}`, 
          details: errorText 
        };
      }

      const data = await response.json();
      console.log("Claude API response received:", JSON.stringify(data).substring(0, 200) + "...");
      
      // Process the content from Claude's response
      if (data.content && Array.isArray(data.content)) {
        // Find text blocks that might contain our JSON
        const textBlocks = data.content.filter(
          (item: any) => item.type === "text"
        );
        
        if (textBlocks.length > 0) {
          // Look for JSON in code blocks
          for (const block of textBlocks) {
            const jsonMatch = block.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              try {
                const parsedJson = JSON.parse(jsonMatch[1]);
                
                // Check if the parsed JSON has a trips array or is an array itself
                if (parsedJson.trips && Array.isArray(parsedJson.trips)) {
                  return parsedJson;
                } else if (Array.isArray(parsedJson)) {
                  // If it's just an array, wrap it in a trips object
                  return { trips: parsedJson };
                } else if (typeof parsedJson === 'object') {
                  // If it's a single trip object, wrap it in a trips array
                  return { trips: [parsedJson] };
                }
              } catch (e) {
                console.error("Failed to parse JSON from code block:", e);
                throw new Error("Failed to parse JSON from Claude API response");
              }
            }
          }
          
          // If no proper JSON found in code blocks, throw an error
          throw new Error("No valid JSON found in Claude API response");
        }
      }
      
      // If we couldn't find any useful data, throw an error
      throw new Error("Invalid response format from Claude API");
      
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in callClaudeApi function:", error);
    throw error;
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Parse request body
    const requestData = await req.json();
    const { prompt } = requestData;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("Processing prompt:", prompt);
    
    try {
      // Call Claude API
      const claudeResponse = await callClaudeApi(prompt);
      
      console.log("Returning successful response to client");
      
      // Return the successful response
      return new Response(JSON.stringify(claudeResponse), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error from Claude API:", error);
      
      // Return an error response
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate trip recommendations", 
          details: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return an error response
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
