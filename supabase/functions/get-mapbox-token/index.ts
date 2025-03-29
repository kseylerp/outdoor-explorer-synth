
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting get-mapbox-token function...')
    
    // Get the Mapbox PUBLIC token from the environment variables
    // First try the specific "MapBox public" secret
    const token = Deno.env.get('MapBox public')
    
    if (token) {
      console.log('Found token in secret: MapBox public')
      console.log('Successfully retrieved Mapbox token')
      
      // Return the token
      return new Response(
        JSON.stringify({
          token,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      )
    } else {
      throw new Error('Mapbox public token not found in environment variables')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})
