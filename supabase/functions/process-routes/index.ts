
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get Mapbox access token from environment variables
const MAPBOX_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN');

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Cache for route data to reduce API calls
const routeCache = new Map();

// Calculate a cache key from request parameters
function getCacheKey(params: any): string {
  return `${params.start.join(',')}_${params.end.join(',')}_${params.waypoints?.join('|') || ''}_${params.mode}_${params.alternatives ? 'alt' : 'noalt'}`;
}

// Call Mapbox Directions API
async function getMapboxDirections(params: any) {
  try {
    if (!MAPBOX_TOKEN) {
      throw new Error('MAPBOX_ACCESS_TOKEN is not configured');
    }

    // Build the coordinates string for the API call
    let coordinates = `${params.start[0]},${params.start[1]};${params.end[0]},${params.end[1]}`;
    
    // Add waypoints if they exist
    if (params.waypoints && params.waypoints.length > 0) {
      coordinates = `${params.start[0]},${params.start[1]}`;
      
      for (const waypoint of params.waypoints) {
        coordinates += `;${waypoint[0]},${waypoint[1]}`;
      }
      
      coordinates += `;${params.end[0]},${params.end[1]}`;
    }
    
    // Set the profile based on the requested mode
    const profile = params.mode === 'walking' ? 'walking' : 
                   params.mode === 'cycling' ? 'cycling' : 
                   params.mode === 'driving' ? 'driving' : 'walking';
    
    // Build the Mapbox Directions API URL
    const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`);
    
    // Add query parameters
    url.searchParams.append('access_token', MAPBOX_TOKEN);
    url.searchParams.append('geometries', 'geojson');
    url.searchParams.append('steps', 'true');
    url.searchParams.append('alternatives', params.alternatives ? 'true' : 'false');
    url.searchParams.append('continue_straight', 'true');
    url.searchParams.append('overview', 'full');
    url.searchParams.append('annotations', 'duration,distance,speed,congestion');
    
    // Call the API
    console.log(`Calling Mapbox Directions API for ${profile} route`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mapbox API error:', errorText);
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Mapbox Directions API:', error);
    throw error;
  }
}

// Process the Mapbox response into our app's journey format
function processMapboxResponse(mapboxData: any, params: any): any {
  try {
    // Check if we have valid routes
    if (!mapboxData.routes || mapboxData.routes.length === 0) {
      throw new Error('No routes found');
    }
    
    const route = mapboxData.routes[0]; // Use the first route
    
    // Extract the steps with instructions
    const steps = route.legs.flatMap((leg: any) => 
      leg.steps.map((step: any) => ({
        maneuver: {
          instruction: step.maneuver.instruction,
          location: step.maneuver.location
        },
        distance: step.distance,
        duration: step.duration
      }))
    );
    
    // Create a segment from the route data
    const segment = {
      mode: params.mode || 'walking',
      from: params.startName || 'Start point',
      to: params.endName || 'End point',
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
      steps: steps,
      elevationGain: null, // We'll fetch elevation data separately
      terrain: params.mode === 'walking' ? 'trail' : 'paved',
      description: `${params.mode || 'walking'} route from ${params.startName || 'Start'} to ${params.endName || 'End'}`
    };
    
    // Calculate bounds from the geometry
    const coordinates = route.geometry.coordinates;
    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    
    for (const [lng, lat] of coordinates) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
    
    const bounds = [[minLng, minLat], [maxLng, maxLat]];
    
    // Create the journey object
    const journey = {
      segments: [segment],
      totalDistance: route.distance,
      totalDuration: route.duration,
      bounds: bounds
    };
    
    return {
      journey: journey,
      mapboxResponse: mapboxData
    };
  } catch (error) {
    console.error('Error processing Mapbox response:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Parse the request body
    const params = await req.json();
    
    // Validate required parameters
    if (!params.start || !params.end) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: start and end coordinates' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check if we have this route in cache
    const cacheKey = getCacheKey(params);
    if (routeCache.has(cacheKey)) {
      console.log('Returning cached route data');
      const cachedData = routeCache.get(cacheKey);
      return new Response(
        JSON.stringify(cachedData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Call Mapbox API to get route directions
    const mapboxData = await getMapboxDirections(params);
    
    // Process the response into our app's format
    const processedData = processMapboxResponse(mapboxData, params);
    
    // Cache the results (with a reasonable max cache size)
    if (routeCache.size > 100) {
      // Clear oldest entries if cache gets too large
      const oldestKey = routeCache.keys().next().value;
      routeCache.delete(oldestKey);
    }
    routeCache.set(cacheKey, processedData);
    
    // Return the processed data
    return new Response(
      JSON.stringify(processedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-routes function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process route request',
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
