
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { query, location } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get API key from environment
    const apiKey = Deno.env.get("CAMPFLARE");
    if (!apiKey) {
      console.error("CampFlare API key not found");
      return new Response(
        JSON.stringify({ error: "API configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Build URL with query parameters
    let searchUrl = `https://api.campflare.com/v1/campgrounds/search?q=${encodeURIComponent(query)}`;
    
    // Add location if provided
    if (location && location.lat && location.lng) {
      searchUrl += `&lat=${location.lat}&lng=${location.lng}`;
    }

    // Make request to CampFlare API
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("CampFlare API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to fetch campgrounds", details: errorData }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ campgrounds: data.results || [] }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
