
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from "./handler.ts";
import { corsHeaders } from "./cors.ts";

// Main serve function with CORS handling
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleRequest(req);
  } catch (error) {
    console.error('Error in trip-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
