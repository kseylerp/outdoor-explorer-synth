
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the API key from environment variables
const geminiApiKey = Deno.env.get('YUGEN_TO_GEMINI_API_KEY');
const geminiApiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Create the prompt for Gemini API
function createGeminiPrompt(userPrompt: string) {
  return `You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations.

Analyze this user request and create detailed trip plans: "${userPrompt}"

Prioritize:
- Off-the-beaten-path locations and local operators
- Shoulder-season times to avoid crowds
- Realistic congestion expectations
- Appropriate preparation guidance
- Realistic timing for activities and travel between locations

Format your response as valid JSON matching this exact schema:
{
  "trip": [
    {
      "id": "unique-id-string",
      "title": "Trip Title",
      "description": "Brief trip description",
      "whyWeChoseThis": "Explanation of why this adventure matches the request",
      "difficultyLevel": "Easy|Moderate|Challenging|Difficult|Expert",
      "priceEstimate": 1234,
      "duration": "X days",
      "location": "Trip destination",
      "suggestedGuides": ["Guide 1", "Guide 2"],
      "mapCenter": {"lng": 0.0, "lat": 0.0},
      "markers": [
        {
          "name": "Point of interest",
          "coordinates": {"lng": 0.0, "lat": 0.0},
          "description": "Description of location",
          "elevation": "Optional elevation info",
          "details": "Additional details"
        }
      ],
      "journey": {
        "segments": [
          {
            "mode": "walking|driving|cycling|transit",
            "from": "Starting point",
            "to": "Ending point",
            "distance": 0,
            "duration": 0,
            "geometry": {
              "coordinates": [[0.0, 0.0], [0.0, 0.0]]
            },
            "elevationGain": 0,
            "terrain": "trail|paved|rocky|mixed",
            "description": "Segment description"
          }
        ],
        "totalDistance": 0,
        "totalDuration": 0,
        "bounds": [[0.0, 0.0], [0.0, 0.0]]
      },
      "itinerary": [
        {
          "day": 1,
          "title": "Day title",
          "description": "Overview of day's activities",
          "activities": [
            {
              "name": "Activity name",
              "type": "Hiking|Sightseeing|Dining|Accommodation|Transportation",
              "duration": "Duration in human-readable format",
              "description": "Activity description",
              "permitRequired": true/false,
              "permitDetails": "Details about permits if required",
              "outfitters": ["Recommended outfitter 1", "Outfitter 2"]
            }
          ]
        }
      ]
    }
  ]
}

Your response MUST be a valid JSON object. Do not include any text outside of the JSON object. Do not format as a code block with backticks.`;
}

// Get detailed thinking steps for UI display
function getThinkingSteps() {
  return [
    "Analyzing user prompt to identify key requirements: destination, activities, duration, and preferences",
    "Researching suitable off-the-beaten-path destinations that match the requirements",
    "Evaluating potential destinations for shoulder season timing and lower congestion",
    "Identifying unique local experiences and authentic cultural interactions",
    "Planning practical itineraries that consider realistic travel times between activities",
    "Identifying appropriate local guides and outfitters for the recommended activities",
    "Mapping key points of interest and creating journey segments with accurate coordinates",
    "Estimating costs for lodging, activities, transportation, and meals to provide a realistic budget",
    "Assessing difficulty levels based on terrain, elevation gain, and required skills",
    "Creating detailed day-by-day itineraries with appropriate pacing and rest time",
    "Finalizing trip options with comprehensive details and formatting response as JSON"
  ];
}

// Create the request payload for Gemini API
function createGeminiRequestPayload(userPrompt: string) {
  return {
    contents: [
      {
        parts: [
          { text: createGeminiPrompt(userPrompt) }
        ]
      }
    ],
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 10650, // Increased from 8192 to 10650 (30% increase)
      topP: 0.8,
      topK: 40
    }
  };
}

// Call the Gemini API with the given prompt
async function callGeminiApi(prompt: string) {
  try {
    console.log("Calling Gemini API with prompt:", prompt);
    
    if (!geminiApiKey) {
      console.error("Gemini API key not configured");
      throw new Error("API_KEY_MISSING: Gemini API key is not configured. Please set the YUGEN_TO_GEMINI_API_KEY secret in your Supabase project.");
    }
    
    const payload = createGeminiRequestPayload(prompt);
    const urlWithKey = `${geminiApiUrl}?key=${geminiApiKey}`;
    
    const response = await fetch(urlWithKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API response error:", errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Gemini API response received");
    
    const thinkingSteps = getThinkingSteps();
    return parseGeminiResponse(data, thinkingSteps);
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}

// Extract JSON from various formats in the Gemini response
function extractJsonFromText(textContent: string) {
  try {
    console.log("Attempting to parse Gemini response JSON");
    
    // First try to extract JSON from code blocks
    const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                      textContent.match(/```\s*([\s\S]*?)\s*```/);
                      
    if (jsonMatch && jsonMatch[1]) {
      console.log("Found JSON code block in response");
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (parseError) {
        console.error("Error parsing JSON from code block:", parseError);
        throw new Error(`JSON parse error in code block: ${parseError.message}`);
      }
    } 
    // If no code blocks, try to extract JSON directly
    else if (textContent.includes('"trip":')) {
      console.log("Trying to find JSON object in plain text");
      const jsonObjectMatch = textContent.match(/\{[\s\S]*"trip"[\s\S]*\}/);
      if (jsonObjectMatch) {
        console.log("Found JSON object in text");
        try {
          return JSON.parse(jsonObjectMatch[0]);
        } catch (parseError) {
          console.error("Error parsing JSON from matched object:", parseError);
          throw new Error(`JSON parse error in matched object: ${parseError.message}`);
        }
      } else {
        throw new Error("Could not locate a valid JSON object with 'trip' key");
      }
    }
    // Last resort - try parsing the entire text
    else {
      console.log("Attempting to parse entire response as JSON");
      try {
        return JSON.parse(textContent);
      } catch (parseError) {
        console.error("Error parsing entire text as JSON:", parseError);
        throw new Error(`Full text JSON parse error: ${parseError.message}`);
      }
    }
  } catch (error) {
    console.error("Error extracting JSON from text:", error);
    throw error;
  }
}

// Validate the trip data structure
function validateTripData(tripData: any) {
  if (!tripData) {
    throw new Error("No valid JSON data could be extracted from response");
  }
  
  if (!tripData.trip) {
    throw new Error("Missing 'trip' property in parsed data");
  }
  
  if (!Array.isArray(tripData.trip)) {
    throw new Error("'trip' property is not an array");
  }
  
  if (tripData.trip.length === 0) {
    throw new Error("'trip' array is empty - no trips generated");
  }
  
  // Validate required fields in each trip
  for (let i = 0; i < tripData.trip.length; i++) {
    const trip = tripData.trip[i];
    const missingFields = [];
    
    if (!trip.id) missingFields.push("id");
    if (!trip.title) missingFields.push("title");
    if (!trip.description) missingFields.push("description");
    if (!trip.whyWeChoseThis) missingFields.push("whyWeChoseThis");
    if (!trip.difficultyLevel) missingFields.push("difficultyLevel");
    if (trip.priceEstimate === undefined) missingFields.push("priceEstimate");
    if (!trip.duration) missingFields.push("duration");
    if (!trip.location) missingFields.push("location");
    if (!trip.mapCenter) missingFields.push("mapCenter");
    if (!trip.itinerary) missingFields.push("itinerary");
    
    if (missingFields.length > 0) {
      throw new Error(`Trip at index ${i} is missing required fields: ${missingFields.join(", ")}`);
    }
  }
  
  console.log("Successfully parsed trip data:", tripData.trip.length, "trips");
  return tripData;
}

// Parse the Gemini API response and extract trip data
function parseGeminiResponse(data: any, thinkingSteps: string[]) {
  let tripData = null;
  let rawTextContent = '';
  
  if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
    const textContent = data.candidates[0].content.parts[0].text;
    rawTextContent = textContent;
    
    if (textContent) {
      try {
        tripData = extractJsonFromText(textContent);
        tripData = validateTripData(tripData);
      } catch (error) {
        console.error("Error processing Gemini response:", error);
        throw new Error(`${error.message} | Raw content: ${textContent.substring(0, 200)}...`);
      }
    } else {
      throw new Error("No text content in Gemini response");
    }
  } else {
    throw new Error("Invalid response structure from Gemini API - missing candidates or content parts");
  }
  
  return {
    thinking: thinkingSteps,
    tripData: tripData,
    rawResponse: rawTextContent // Include the full raw response for better debugging
  };
}

// Main handler function for Edge Function requests
serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt in request body" }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          },
          status: 400 
        }
      );
    }
    
    console.log(`Processing prompt with Gemini:`, prompt);
    
    // Call the Gemini API
    const result = await callGeminiApi(prompt);
    
    // Return the structured response with thinking
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return a structured error response with detailed information
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error instanceof Error ? error.message : String(error),
        errorType: error.name || "UnknownError",
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
