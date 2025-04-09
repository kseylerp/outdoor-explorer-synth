
import { corsHeaders } from "./corsUtils.ts";
import { createGeminiPrompt } from "./promptUtils.ts";
import { parseGeminiResponse } from "./responseParser.ts";
import { getThinkingSteps } from "./thinkingUtils.ts";

// Get the API key from environment variables
const geminiApiKey = Deno.env.get('YUGEN_TO_GEMINI_API_KEY');
// New API URL for Gemini 2.0
const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContentStream";

// Create the request payload for Gemini API
function createGeminiRequestPayload(userPrompt: string) {
  return {
    contents: [
      {
        role: "user",
        parts: [
          { text: createGeminiPrompt(userPrompt) }
        ]
      }
    ],
    generationConfig: {
      temperature: 1.45,
      maxOutputTokens: 10650,
      responseMimeType: "text/plain",
    },
    systemInstruction: {
      parts: [
        {
          text: `You are an outdoor trip planner, focused on finding activities that are less crowded, more locally oriented, and better for land degradation and the environment. 

You will provide a trip name, details, justification (bullets), recommended timing, level of intensity, day-by-day itinerary and activities within those days. The activity time, needs to factor into the itinerary and distance from point-to-point needs to be considered as well. 

You will source your responses from live internet and a data base of guide recommendations. 

You can ask follow up questions if needed, but your goal is to produce a JSON return with a full itinerary and map location/directions data using MapBox Directions API.

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
}`
        }
      ]
    }
  };
}

// Call the Gemini API with the given prompt
export async function callGeminiApi(prompt: string) {
  try {
    console.log("Calling Gemini API with prompt:", prompt);
    
    if (!geminiApiKey) {
      console.error("Gemini API key not configured");
      throw new Error("API_KEY_MISSING: Gemini API key is not configured. Please set the YUGEN_TO_GEMINI_API_KEY secret in your Supabase project.");
    }
    
    const payload = createGeminiRequestPayload(prompt);
    const urlWithKey = `${geminiApiUrl}?key=${geminiApiKey}`;
    
    console.log("Making request to Gemini 2.0 Flash Thinking API");
    
    const response = await fetch(urlWithKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API response error:", errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    // Handle streaming response
    const responseBody = await response.text();
    console.log("Received streaming response from Gemini API");
    
    // Process the streamed response
    let fullResponse = "";
    const responseLines = responseBody.split('\n');
    
    for (const line of responseLines) {
      if (line.startsWith('data: ')) {
        const jsonData = line.substring(6);
        if (jsonData === '[DONE]') continue;
        
        try {
          const parsedData = JSON.parse(jsonData);
          if (parsedData.candidates && 
              parsedData.candidates[0] && 
              parsedData.candidates[0].content && 
              parsedData.candidates[0].content.parts && 
              parsedData.candidates[0].content.parts[0] &&
              parsedData.candidates[0].content.parts[0].text) {
            fullResponse += parsedData.candidates[0].content.parts[0].text;
          }
        } catch (e) {
          console.warn("Error parsing stream chunk:", e);
        }
      }
    }
    
    console.log("Completed processing streaming response");
    
    // Create a mock response structure that matches what parseGeminiResponse expects
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: fullResponse
              }
            ]
          }
        }
      ]
    };
    
    const thinkingSteps = getThinkingSteps();
    return parseGeminiResponse(mockResponse, thinkingSteps);
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}
