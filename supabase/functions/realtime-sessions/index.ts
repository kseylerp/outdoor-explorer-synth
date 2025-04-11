
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default response for OPTIONS requests
const handleOptions = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }
  
  try {
    // Parse request body
    const { action, instructions, voice = "sage" } = await req.json(); // Default to "sage" voice
    
    if (action !== 'create_session') {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Supported actions: create_session' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    console.log('Creating session with OpenAI Realtime API...');
    
    // Default instructions for travel planning and JSON formatting
    const defaultInstructions = `You are an adventure guide that specializes in offbeat travel recommendations. 
    Help users plan unique outdoor adventures with hiking trails, camping options, and other outdoor activities. 
    First, engage in natural conversation to understand the user's request. 
    Ask follow-up questions to better understand their preferences for:
    - Destination or general region they're interested in
    - Activity level (easy, moderate, challenging)
    - Duration of the trip
    - Any special interests (wildlife, photography, local food)
    - Travel style (budget, luxury, family-friendly)
    
    After you have enough information, inform them you'll show them trip options on screen.
    Format your response with a JSON object containing this structure:
    {
      "trip": [
        {
          "id": "unique-id-1",
          "title": "Trip Title",
          "description": "Detailed description of the trip",
          "location": "Location name",
          "duration": "X days",
          "difficultyLevel": "easy|moderate|challenging",
          "priceEstimate": number,
          "whyWeChoseThis": "Reason for recommendation",
          "activities": ["hiking", "camping", etc],
          "itinerary": [
            {
              "day": 1,
              "title": "Day 1 title",
              "description": "Day 1 activities"
            },
            ...
          ]
        }
      ]
    }`;
    
    // Request a session token from OpenAI
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: voice, // Use the specified voice (default: "sage")
        instructions: instructions || defaultInstructions
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Session created successfully:', data.id);
    
    // Return session information and client secret to the client
    return new Response(
      JSON.stringify({
        sessionId: data.id,
        clientSecret: data.client_secret.value,
        expiresAt: data.client_secret.expires_at,
        voice: voice // Return the voice being used
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in realtime-sessions function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
