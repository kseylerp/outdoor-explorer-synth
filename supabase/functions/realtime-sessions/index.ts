
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
    console.log('Processing realtime session request');
    // Parse request body
    const { action, instructions, voice = "sage" } = await req.json(); // Default to "sage" voice
    
    if (action !== 'create_session') {
      console.error('Invalid action requested:', action);
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
      console.error('OPENAI_API_KEY is not set in environment variables');
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    console.log('Creating session with OpenAI Realtime API...');
    
    // Enhanced instructions for travel planning with improved triage and follow-up questions
    const defaultInstructions = `You are an adventure guide that specializes in offbeat travel recommendations. 
    Help users plan unique outdoor adventures with hiking trails, camping options, and other outdoor activities. 
    
    When a user starts a conversation:
    1. First, briefly acknowledge their request with "I understand you're looking for [brief summary]"
    2. Then ask 2-3 follow-up questions to better understand their needs, such as:
       - Date range they're planning to travel (also mention if you can suggest less crowded times)
       - Their skill level for relevant activities
       - If they need equipment recommendations
       - Group size and any special considerations (kids, seniors, accessibility needs)
       
    If they mention their skill level is uncertain, provide concrete examples to help them assess, such as:
    - For hiking: "Can you comfortably walk uphill for 2+ hours?" or "Are you comfortable with steep drop-offs?"
    - For mountain biking: "Can you handle dropping down a few feet from a ledge?"
    - For water activities: "Do you have experience with Class II-III rapids?"
    
    After gathering enough information, say "Thanks for sharing those details. Let me show you some great adventure options!"
    
    Format your final recommendation as a JSON object with this structure:
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
          "bestTimeToVisit": "Spring/Summer/Fall/Winter with specific months if applicable",
          "crowdAvoidanceTip": "When to visit to avoid crowds",
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
    console.log('Sending request to OpenAI with voice:', voice);
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
    console.log('Session created successfully with ID:', data.id);
    
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
