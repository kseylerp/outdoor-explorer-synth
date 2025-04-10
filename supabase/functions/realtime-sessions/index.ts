
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OFFBEAT_OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('API key is not configured');
    }

    const { action, sessionId, instructions, voice } = await req.json();

    console.log(`Processing ${action} request`);
    
    // Handle different actions
    switch (action) {
      case 'create_session':
        return await createSession(OPENAI_API_KEY, instructions, voice);
      default:
        throw new Error('Unknown action');
    }
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createSession(apiKey: string, instructions = "You are a helpful assistant that specializes in offbeat adventure travel recommendations.", voice = "alloy") {
  console.log("Creating new realtime session");
  
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice,
        instructions: instructions || "You are a helpful assistant that specializes in offbeat adventure travel recommendations."
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      throw new Error(`Failed to create session: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Session created successfully with ID:", data.id);
    
    return new Response(
      JSON.stringify({ 
        sessionId: data.id,
        clientSecret: data.client_secret?.value,
        expiresAt: data.expires_at
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}
