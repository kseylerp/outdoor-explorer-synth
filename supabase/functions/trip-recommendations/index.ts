
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Claude client configuration
const claudeApiKey = Deno.env.get('Offbeat-mobile-claude');
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
  console.log("Calling Claude API with prompt:", prompt);
  
  const payload = {
    model: claudeModel,
    max_tokens: 20000,
    temperature: 1,
    system: "You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations in valid JSON format.\n\nAnalyze user prompts for destination, activities, duration, budget, intensity level, and special requirements.\n\nKey requirements:\n- Prioritize off-the-beaten-path locations and local operators\n- Create separate route segments for multi-modal journeys\n- Include sufficient waypoints to accurately represent trails\n- Ensure all coordinates use [longitude, latitude] format\n- Link each activity to its corresponding route data\n- Generate complete route geometry for MapBox visualization",
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
            trips: {
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
                    type: "string",
                    description: "Estimated price of the trip"
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
                                    },
                                    minItems: 2,
                                    maxItems: 2
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
                                        },
                                        minItems: 2,
                                        maxItems: 2
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
                          },
                          minItems: 2,
                          maxItems: 2
                        },
                        minItems: 2,
                        maxItems: 2
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
                                description: "Recommended outfitters for this activity",
                                items: {
                                  type: "string"
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
            }
          },
          required: [
            "trips"
          ]
        }
      }
    ]
  };

  try {
    console.log("Sending request to Claude API");
    const response = await fetch(claudeApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Claude API response received");
    
    // Check if there's a tool response
    if (data.content && Array.isArray(data.content)) {
      // Find the tool response
      const toolBlock = data.content.find(
        (item: any) => item.type === "tool_use"
      );
      
      if (toolBlock && toolBlock.input) {
        console.log("Successfully parsed Claude tool response");
        return JSON.parse(toolBlock.input);
      } else {
        // If there's no tool response, try to find a text block with JSON
        const textBlock = data.content.find(
          (item: any) => item.type === "text"
        );
        
        if (textBlock) {
          // Try to extract JSON from the text
          try {
            const jsonMatch = textBlock.text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              console.log("Extracted JSON from code block in text response");
              return JSON.parse(jsonMatch[1]);
            } else {
              console.log("No JSON code block found, attempting to parse entire text as JSON");
              return JSON.parse(textBlock.text);
            }
          } catch (e) {
            console.error("Failed to extract JSON from text:", e);
            throw new Error("Failed to extract valid JSON from Claude response");
          }
        }
      }
    }
    
    console.error("Unexpected Claude API response format:", data);
    throw new Error("Unexpected Claude API response format");
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
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
    
    // Return the response
    return new Response(JSON.stringify(claudeResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error processing request", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
