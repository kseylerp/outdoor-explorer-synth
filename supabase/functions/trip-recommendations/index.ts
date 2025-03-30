
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
              }
            }
          }
          
          // If no proper JSON found in code blocks, try to create fallback trips
          return createFallbackTrips(prompt);
        }
      }
      
      // If we couldn't find any useful data, create fallback trips
      return createFallbackTrips(prompt);
      
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return createFallbackTrips(prompt);
    }
  } catch (error) {
    console.error("Error in callClaudeApi function:", error);
    return createFallbackTrips(prompt);
  }
}

// Helper function to create fallback trips when Claude API fails to return proper data
function createFallbackTrips(prompt: string) {
  console.log("Creating fallback trips for prompt:", prompt);
  
  // Extract location info from the prompt
  const locationMatch = prompt.match(/(?:to|in|at|around)\s+([A-Za-z\s]+National Park|[A-Za-z\s]+Mountains|[A-Za-z\s]+Canyon|[A-Za-z\s]+Valley|[A-Za-z\s]+Lake|[A-Za-z\s]+Forest|[A-Za-z\s]+Coast|[A-Za-z\s]+Beach|[A-Za-z\s]+Island|[A-Za-z]+)/i);
  const location = locationMatch ? locationMatch[1].trim() : "Grand Canyon";
  
  // Default coordinates based on common outdoor locations
  let mapCenter = { lng: -112.1401, lat: 36.0544 }; // Default to Grand Canyon
  
  // Adjust coordinates based on extracted location
  if (location.toLowerCase().includes("yosemite")) {
    mapCenter = { lng: -119.5383, lat: 37.8651 };
  } else if (location.toLowerCase().includes("zion")) {
    mapCenter = { lng: -113.0263, lat: 37.2982 };
  } else if (location.toLowerCase().includes("yellowstone")) {
    mapCenter = { lng: -110.5885, lat: 44.4280 };
  }
  
  // Extract activities from the prompt
  const activities = [];
  if (prompt.toLowerCase().includes("hik")) activities.push("Hiking");
  if (prompt.toLowerCase().includes("raft")) activities.push("Rafting");
  if (prompt.toLowerCase().includes("kayak")) activities.push("Kayaking");
  if (prompt.toLowerCase().includes("camp")) activities.push("Camping");
  if (prompt.toLowerCase().includes("climb")) activities.push("Climbing");
  if (prompt.toLowerCase().includes("bike")) activities.push("Mountain Biking");
  if (activities.length === 0) activities.push("Hiking", "Camping");
  
  // Extract duration from the prompt
  const durationMatch = prompt.match(/(\d+)\s*days?/i);
  const duration = durationMatch ? `${durationMatch[1]} days` : "7 days";
  const numDays = parseInt(durationMatch ? durationMatch[1] : "7");
  
  // Create a simple journey path
  const createSimpleJourney = () => {
    const lng = mapCenter.lng;
    const lat = mapCenter.lat;
    
    return {
      segments: [
        {
          mode: "walking",
          from: "Trailhead",
          to: "Scenic Viewpoint",
          distance: 5000,
          duration: 7200,
          geometry: {
            coordinates: [
              [lng - 0.02, lat - 0.02],
              [lng - 0.01, lat - 0.01],
              [lng, lat],
              [lng + 0.01, lat + 0.01],
              [lng + 0.02, lat + 0.02]
            ]
          },
          steps: [
            {
              maneuver: {
                instruction: "Start at the trailhead",
                location: [lng - 0.02, lat - 0.02]
              },
              distance: 2000,
              duration: 2400
            },
            {
              maneuver: {
                instruction: "Continue on the trail",
                location: [lng, lat]
              },
              distance: 3000,
              duration: 4800
            }
          ],
          elevationGain: 150,
          terrain: "trail",
          description: "A beautiful trail with stunning views"
        }
      ],
      totalDistance: 5000,
      totalDuration: 7200,
      bounds: [
        [lng - 0.03, lat - 0.03],
        [lng + 0.03, lat + 0.03]
      ]
    };
  };
  
  // Create itinerary
  const createItinerary = () => {
    const itinerary = [];
    
    for (let i = 1; i <= numDays; i++) {
      const dayActivities = [];
      // Add 1-3 activities per day
      const numActivities = Math.min(Math.floor(Math.random() * 3) + 1, activities.length);
      
      for (let j = 0; j < numActivities; j++) {
        const activityType = activities[j % activities.length];
        dayActivities.push({
          name: `${activityType} - Day ${i}`,
          type: activityType,
          duration: activityType.includes("Hik") ? "4 hours" : "3 hours",
          description: `Enjoy ${activityType.toLowerCase()} in the beautiful ${location} area.`,
          permitRequired: Math.random() > 0.7,
          permitDetails: Math.random() > 0.7 ? "Permits available at visitor center" : undefined,
          outfitters: Math.random() > 0.5 ? [`Local ${activityType} Guides`] : undefined
        });
      }
      
      itinerary.push({
        day: i,
        title: `Day ${i} - Exploring ${location}`,
        description: `Spend the day exploring the beautiful scenery of ${location}.`,
        activities: dayActivities
      });
    }
    
    return itinerary;
  };
  
  // Create markers
  const createMarkers = () => {
    const lng = mapCenter.lng;
    const lat = mapCenter.lat;
    
    return [
      {
        name: "Visitor Center",
        coordinates: { lng, lat },
        description: `${location} Visitor Center - Start your journey here`,
        elevation: "6,200 ft"
      },
      {
        name: "Scenic Viewpoint",
        coordinates: { lng: lng + 0.02, lat: lat + 0.02 },
        description: "Amazing panoramic views",
        elevation: "7,400 ft"
      },
      {
        name: "Trailhead",
        coordinates: { lng: lng - 0.02, lat: lat - 0.02 },
        description: "Main trail access point",
        elevation: "5,800 ft"
      }
    ];
  };
  
  // Create two trip options
  return {
    trips: [
      {
        id: "fallback-1",
        title: `${location} Adventure`,
        description: `Experience the natural beauty of ${location} with a ${duration} adventure filled with ${activities.join(", ")}.`,
        whyWeChoseThis: `${location} offers some of the most spectacular scenery and outdoor experiences in the region.`,
        difficultyLevel: "Moderate",
        priceEstimate: "$1,000 - $1,500",
        duration,
        location,
        suggestedGuides: [`${location} Adventure Guides`, "Local Experts"],
        mapCenter,
        markers: createMarkers(),
        journey: createSimpleJourney(),
        itinerary: createItinerary()
      },
      {
        id: "fallback-2",
        title: `Off the Beaten Path: ${location}`,
        description: `Discover hidden gems in ${location} with this customized ${duration} trip.`,
        whyWeChoseThis: `This trip takes you to less-traveled areas of ${location} for a more intimate wilderness experience.`,
        difficultyLevel: "Challenging",
        priceEstimate: "$1,200 - $1,800",
        duration,
        location,
        suggestedGuides: [`${location} Wilderness Guides`],
        mapCenter,
        markers: createMarkers(),
        journey: createSimpleJourney(),
        itinerary: createItinerary()
      }
    ]
  };
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
    
    // Call Claude API
    const claudeResponse = await callClaudeApi(prompt);
    
    // Check if there was an error in the Claude API call
    if (claudeResponse.error) {
      console.error("Error response from Claude API:", claudeResponse.error);
      
      // Return an error response with status code 400
      return new Response(
        JSON.stringify({ 
          error: claudeResponse.error, 
          details: claudeResponse.details || "See edge function logs for more details"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Returning successful response to client");
    
    // Return the successful response
    return new Response(JSON.stringify(claudeResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
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
