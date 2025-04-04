
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the API keys from environment variables
const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

// API URLs
const claudeApiUrl = "https://api.anthropic.com/v1/messages";
const claudeModel = "claude-3-7-sonnet-20250219";
const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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
      console.error("Claude API key is not set in environment variables");
      throw new Error("Claude API key is not set in environment variables");
    }
    
    const payload = {
      model: claudeModel,
      max_tokens: 6000,
      temperature: 1,
      system: "You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations in valid JSON format.\n\nAnalyze user prompts for destination, activities, duration, budget, intensity level, and special requirements.\n\n- Prioritize off-the-beaten-path locations and local operators\n- Consider shoulder-season times\n- Consider congestion\n- Consider preparedness\n- Activities and Itineraries need to consider the time it will take to do that activity, time of day, if you need to camp, and how long to get back.",
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
      ],
      tools: [
        {
          type: "custom",
          name: "trip_format",
          description: "Formats the JSON response for the web app.",
          input_schema: {
            type: "object",
            properties: {
              trip: {
                type: "array",
                description: "List of trip recommendations",
                items: {
                  type: "object",
                  required: [
                    "id",
                    "title",
                    "description",
                    "whyWeChoseThis",
                    "difficultyLevel",
                    "priceEstimate",
                    "duration",
                    "location",
                    "suggestedGuides",
                    "mapCenter",
                    "markers",
                    "journey",
                    "itinerary"
                  ],
                  properties: {
                    id: {
                      type: "string",
                      description: "Unique identifier for the trip"
                    },
                    title: {
                      type: "string",
                      description: "Title of the trip"
                    },
                    description: {
                      type: "string",
                      description: "Brief description of the trip"
                    },
                    whyWeChoseThis: {
                      type: "string",
                      description: "Explanation of why this adventure matches the user's request"
                    },
                    difficultyLevel: {
                      type: "string",
                      enum: [
                        "Easy",
                        "Moderate",
                        "Challenging",
                        "Difficult",
                        "Expert"
                      ],
                      description: "Difficulty level of the trip"
                    },
                    priceEstimate: {
                      type: "number",
                      description: "Estimated price of the trip in dollars"
                    },
                    duration: {
                      type: "string",
                      description: "Duration of the trip, e.g., '3 days'"
                    },
                    location: {
                      type: "string",
                      description: "Destination of the trip"
                    },
                    suggestedGuides: {
                      type: "array",
                      description: "List of recommended guides for the trip",
                      items: {
                        type: "string"
                      }
                    },
                    mapCenter: {
                      type: "object",
                      required: [
                        "lng",
                        "lat"
                      ],
                      description: "Center coordinates for the trip map",
                      properties: {
                        lng: {
                          type: "number",
                          description: "Longitude of the map center"
                        },
                        lat: {
                          type: "number",
                          description: "Latitude of the map center"
                        }
                      }
                    },
                    markers: {
                      type: "array",
                      description: "Points of interest for the trip",
                      items: {
                        type: "object",
                        required: [
                          "name",
                          "coordinates",
                          "description"
                        ],
                        properties: {
                          name: {
                            type: "string",
                            description: "Name of the point of interest"
                          },
                          coordinates: {
                            type: "object",
                            required: [
                              "lng",
                              "lat"
                            ],
                            description: "Coordinates of the point of interest",
                            properties: {
                              lng: {
                                type: "number",
                                description: "Longitude of the point of interest"
                              },
                              lat: {
                                type: "number",
                                description: "Latitude of the point of interest"
                              }
                            }
                          },
                          description: {
                            type: "string",
                            description: "Description of the location"
                          },
                          elevation: {
                            type: "string",
                            description: "Optional elevation information in feet"
                          },
                          details: {
                            type: "string",
                            description: "Additional details about the location"
                          }
                        }
                      }
                    },
                    journey: {
                      type: "object",
                      required: [
                        "segments",
                        "totalDistance",
                        "totalDuration",
                        "bounds"
                      ],
                      description: "Journey details for the trip",
                      properties: {
                        segments: {
                          type: "array",
                          description: "Segments of the journey",
                          items: {
                            type: "object",
                            required: [
                              "mode",
                              "from",
                              "to",
                              "distance",
                              "duration",
                              "geometry"
                            ],
                            properties: {
                              mode: {
                                type: "string",
                                enum: [
                                  "walking",
                                  "driving",
                                  "cycling",
                                  "transit"
                                ],
                                description: "Mode of transportation for this segment"
                              },
                              from: {
                                type: "string",
                                description: "Starting point for this segment"
                              },
                              to: {
                                type: "string",
                                description: "Ending point for this segment"
                              },
                              distance: {
                                type: "number",
                                description: "Distance in meters"
                              },
                              duration: {
                                type: "number",
                                description: "Duration in seconds"
                              },
                              geometry: {
                                type: "object",
                                required: [
                                  "coordinates"
                                ],
                                description: "Geometry of the route",
                                properties: {
                                  coordinates: {
                                    type: "array",
                                    description: "Array of coordinate pairs for the route",
                                    items: {
                                      type: "array",
                                      description: "Coordinate pair [longitude, latitude]",
                                      items: {
                                        type: "number"
                                      }
                                    }
                                  }
                                }
                              },
                              steps: {
                                type: "array",
                                description: "Steps within this segment",
                                items: {
                                  type: "object",
                                  required: [
                                    "maneuver",
                                    "distance",
                                    "duration"
                                  ],
                                  properties: {
                                    maneuver: {
                                      type: "object",
                                      required: [
                                        "instruction",
                                        "location"
                                      ],
                                      properties: {
                                        instruction: {
                                          type: "string",
                                          description: "Instruction for this step"
                                        },
                                        location: {
                                          type: "array",
                                          description: "Location coordinates [longitude, latitude]",
                                          items: {
                                            type: "number"
                                          }
                                        }
                                      }
                                    },
                                    distance: {
                                      type: "number",
                                      description: "Distance in meters"
                                    },
                                    duration: {
                                      type: "number",
                                      description: "Duration in seconds"
                                    }
                                  }
                                }
                              },
                              elevationGain: {
                                type: "number",
                                description: "Elevation gain in meters"
                              },
                              terrain: {
                                type: "string",
                                enum: [
                                  "trail",
                                  "paved",
                                  "rocky",
                                  "mixed"
                                ],
                                description: "Type of terrain for this segment"
                              },
                              description: {
                                type: "string",
                                description: "Description of this segment"
                              }
                            }
                          }
                        },
                        totalDistance: {
                          type: "number",
                          description: "Total distance of the journey in meters"
                        },
                        totalDuration: {
                          type: "number",
                          description: "Total duration of the journey in seconds"
                        },
                        bounds: {
                          type: "array",
                          description: "Bounding box for the journey [southwest, northeast]",
                          items: {
                            type: "array",
                            description: "Coordinate pair [longitude, latitude]",
                            items: {
                              type: "number"
                            }
                          }
                        }
                      }
                    },
                    itinerary: {
                      type: "array",
                      description: "Daily itinerary for the trip",
                      items: {
                        type: "object",
                        required: [
                          "day",
                          "title",
                          "description",
                          "activities"
                        ],
                        properties: {
                          day: {
                            type: "integer",
                            description: "Day number in the itinerary"
                          },
                          title: {
                            type: "string",
                            description: "Title for this day"
                          },
                          description: {
                            type: "string",
                            description: "Overview of this day's activities"
                          },
                          activities: {
                            type: "array",
                            description: "Activities for this day",
                            items: {
                              type: "object",
                              required: [
                                "name",
                                "type",
                                "duration",
                                "description",
                                "permitRequired"
                              ],
                              properties: {
                                name: {
                                  type: "string",
                                  description: "Name of the activity"
                                },
                                type: {
                                  type: "string",
                                  enum: [
                                    "Hiking",
                                    "Sightseeing",
                                    "Dining",
                                    "Accommodation",
                                    "Transportation"
                                  ],
                                  description: "Type of activity"
                                },
                                duration: {
                                  type: "string",
                                  description: "Duration of the activity in human-readable format"
                                },
                                description: {
                                  type: "string",
                                  description: "Description of the activity"
                                },
                                permitRequired: {
                                  type: "boolean",
                                  description: "Whether a permit is required for this activity"
                                },
                                permitDetails: {
                                  type: "string",
                                  description: "Details about required permits"
                                },
                                outfitters: {
                                  type: "array",
                                  items: {
                                    type: "string"
                                  },
                                  description: "Recommended outfitters for this activity"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            required: [
              "trip"
            ]
          }
        }
      ],
      thinking: {
        type: "enabled",
        budget_tokens: 4800
      }
    };

    const response = await fetch(claudeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API response error:", errorData);
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Claude API response received");
    
    // Handle both the thinking and tool use responses
    const result = {
      thinking: null,
      tripData: null
    };
    
    // Extract thinking if available
    if (data.thinking && data.thinking.thinking) {
      result.thinking = data.thinking.thinking;
    }
    
    if (data.content && data.content.length > 0) {
      // Look for tool use in the response
      const toolUse = data.content.find(item => 
        item.type === 'tool_use' && 
        item.name === 'trip_format'
      );
      
      if (toolUse && toolUse.input) {
        // Parse and return the structured trip data
        result.tripData = toolUse.input;
      } else {
        // If no structured data, try to extract from text
        const textContent = data.content.find(item => item.type === 'text');
        if (textContent && textContent.text) {
          console.log("No structured data found in response, trying to extract from text");
          try {
            // Try to find JSON in the text response
            const jsonMatch = textContent.text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              const extractedJson = JSON.parse(jsonMatch[1]);
              result.tripData = extractedJson;
            }
            
            throw new Error("No JSON format found in text response");
          } catch (error) {
            console.error("Error extracting JSON from text:", error);
            throw new Error("Could not extract structured data from response");
          }
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error("Claude API call failed:", error);
    throw error;
  }
}

// Helper for Gemini API requests
async function callGeminiApi(prompt: string) {
  try {
    console.log("Calling Gemini API with prompt:", prompt);
    
    if (!geminiApiKey) {
      console.error("Gemini API key is not set in environment variables");
      throw new Error("Gemini API key is not set in environment variables");
    }
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations.

Analyze this user request and create detailed trip plans: "${prompt}"

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

Include exactly 2 trip options, each with complete details for all fields.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 8192,
        topP: 0.8,
        topK: 40
      }
    };

    // Construct the URL with API key
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
    
    // Define steps in the thinking process for Gemini (since it doesn't have built-in thinking like Claude)
    const thinkingSteps = [
      "Analyzing user prompt to identify key requirements: destination, activities, duration, and preferences",
      "Researching suitable off-the-beaten-path destinations that match the requirements",
      "Evaluating potential destinations for shoulder season timing and lower congestion",
      "Planning practical itineraries that consider realistic travel times between activities",
      "Identifying appropriate local guides and outfitters for the recommended activities",
      "Mapping key points of interest and creating journey segments with accurate coordinates",
      "Estimating costs for lodging, activities, transportation, and meals to provide a realistic budget",
      "Assessing difficulty levels based on terrain, elevation gain, and required skills",
      "Creating detailed day-by-day itineraries with appropriate pacing and rest time"
    ];
    
    // Parse the JSON from the text response
    let tripData = null;
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      const textContent = data.candidates[0].content.parts[0].text;
      
      if (textContent) {
        // Try to extract JSON from the response
        try {
          // Look for JSON pattern
          const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                          textContent.match(/\{[\s\S]*"trip"[\s\S]*\}/);
                          
          if (jsonMatch) {
            const jsonText = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
            tripData = JSON.parse(jsonText);
          } else {
            // Try parsing the entire text as JSON
            tripData = JSON.parse(textContent);
          }
        } catch (error) {
          console.error("Error parsing JSON from Gemini response:", error);
          throw new Error("Could not extract valid JSON from Gemini response");
        }
      }
    }
    
    return {
      thinking: thinkingSteps,
      tripData: tripData
    };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { prompt, model = 'claude' } = await req.json();
    
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
    
    console.log(`Processing prompt with ${model} model:`, prompt);
    
    // Call the appropriate AI API based on the selected model
    let result;
    if (model === 'gemini') {
      result = await callGeminiApi(prompt);
    } else {
      // Default to Claude
      result = await callClaudeApi(prompt);
    }
    
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
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error.message 
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
