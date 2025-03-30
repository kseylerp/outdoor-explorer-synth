
import { corsHeaders } from "./cors.ts";
import { claudeClient } from "./claude.ts";
import { validatePrompt } from "./validators.ts";

export async function handleRequest(req: Request): Promise<Response> {
  try {
    const { prompt } = await req.json();
    
    // Validate the prompt
    const validationError = validatePrompt(prompt);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Request trip recommendations from Claude API
    const tripRecommendations = await claudeClient.generateTripRecommendations(prompt);
    
    // Return the validated response
    return new Response(
      tripRecommendations,
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in handleRequest:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
