
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
const claudeModel = "claude-3-5-haiku-20241022";

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
      max_tokens: 6000,
      temperature: 1,
      system: "You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations in valid JSON format.\n\nAnalyze user prompts for destination, activities, duration, budget, intensity level, and special requirements.\n\n- Prioritize off-the-beaten-path locations and local operators\n- Consider shoulder-season times\n- Consider congestion\n- Consider preparedness",
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
                              "geometry",
                              "steps"
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
      ]
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
    
    if (data.content && data.content.length > 0) {
      // Look for tool use in the response
      const toolUse = data.content.find(item => 
        item.type === 'tool_use' && 
        item.name === 'trip_format'
      );
      
      if (toolUse && toolUse.input) {
        // Parse and return the structured trip data
        return toolUse.input;
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
              return extractedJson;
            }
            
            throw new Error("No JSON format found in text response");
          } catch (error) {
            console.error("Error extracting JSON from text:", error);
            throw new Error("Could not extract structured data from response");
          }
        }
      }
    }
    
    throw new Error("No usable content in Claude API response");
  } catch (error) {
    console.error("Claude API call failed:", error);
    throw error;
  }
}

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
    
    console.log("Processing prompt:", prompt);
    
    // Call Claude API and get structured response
    const tripData = await callClaudeApi(prompt);
    
    // Return the structured response
    return new Response(
      JSON.stringify(tripData),
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
