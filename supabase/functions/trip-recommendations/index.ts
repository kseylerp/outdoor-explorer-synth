
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
const claudeModel = "claude-3-sonnet-20240229"; // Claude 3.7 Sonnet

// Token costs for cost tracking
const CLAUDE_SONNET_INPUT_COST = 0.00000375; // $0.00375 per 1K input tokens
const CLAUDE_SONNET_OUTPUT_COST = 0.00001125; // $0.01125 per 1K output tokens

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
      max_tokens: 2000, // Limit token usage to 2000 as requested
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
              },
              costTracking: {
                type: "object",
                properties: {
                  promptTokens: {
                    type: "number",
                    description: "Number of tokens in the prompt"
                  },
                  completionTokens: {
                    type: "number",
                    description: "Number of tokens in the completion"
                  },
                  totalTokens: {
                    type: "number",
                    description: "Total number of tokens used"
                  },
                  estimatedCost: {
                    type: "number",
                    description: "Estimated cost in USD"
                  }
                }
              }
            },
            required: [
              "trip",
              "costTracking"
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
    
    // Extract token usage from response headers or body
    let promptTokens = 0;
    let completionTokens = 0;
    
    if (data.usage) {
      promptTokens = data.usage.input_tokens || 0;
      completionTokens = data.usage.output_tokens || 0;
    } else {
      // Estimate token count if not provided (rough estimate)
      promptTokens = Math.ceil(prompt.length / 4);
      completionTokens = data.content ? Math.ceil(JSON.stringify(data.content).length / 4) : 0;
    }
    
    const totalTokens = promptTokens + completionTokens;
    const estimatedCost = 
      (promptTokens * CLAUDE_SONNET_INPUT_COST / 1000) + 
      (completionTokens * CLAUDE_SONNET_OUTPUT_COST / 1000);
    
    const costTracking = {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost,
      inputCostPer1k: CLAUDE_SONNET_INPUT_COST * 1000,
      outputCostPer1k: CLAUDE_SONNET_OUTPUT_COST * 1000
    };
    
    if (data.content && data.content.length > 0) {
      // Look for tool use in the response
      const toolUse = data.content.find(item => 
        item.type === 'tool_use' && 
        item.name === 'trip_format'
      );
      
      if (toolUse && toolUse.input) {
        // Add cost tracking to the response
        const responseData = toolUse.input;
        responseData.costTracking = costTracking;
        
        return responseData;
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
              extractedJson.costTracking = costTracking;
              return extractedJson;
            }
            
            // Return with cost info even if extraction fails
            return {
              trip: generateFallbackTrips(),
              costTracking,
              error: "Could not extract structured data from response"
            };
          } catch (error) {
            console.error("Error extracting JSON from text:", error);
            return {
              trip: generateFallbackTrips(),
              costTracking,
              error: "Could not extract structured data from response"
            };
          }
        }
      }
    }
    
    // Return fallback data with cost tracking
    return {
      trip: generateFallbackTrips(),
      costTracking,
      error: "No usable content in Claude API response"
    };
  } catch (error) {
    console.error("Claude API call failed:", error);
    
    // Return fallback data with estimated costs
    const estimatedTokens = Math.ceil(prompt.length / 4);
    return {
      trip: generateFallbackTrips(),
      costTracking: {
        promptTokens: estimatedTokens,
        completionTokens: 0,
        totalTokens: estimatedTokens,
        estimatedCost: (estimatedTokens * CLAUDE_SONNET_INPUT_COST / 1000),
        inputCostPer1k: CLAUDE_SONNET_INPUT_COST * 1000,
        outputCostPer1k: CLAUDE_SONNET_OUTPUT_COST * 1000,
        error: true
      },
      error: error.message
    };
  }
}

// Generate fallback trips to ensure we always return something useful
function generateFallbackTrips() {
  return [
    {
      id: "fallback-trip-1",
      title: "Alaska Wilderness Adventure",
      description: "Experience the raw beauty of Alaska's pristine wilderness on this eco-friendly adventure.",
      whyWeChoseThis: "This trip combines natural beauty with adventure while keeping environmental impact low.",
      difficultyLevel: "Moderate",
      priceEstimate: 2850,
      duration: "5 days",
      location: "Kenai Peninsula, Alaska",
      suggestedGuides: ["Alaska Wildland Adventures", "Northern Exposures"],
      mapCenter: {
        lng: -150.5002,
        lat: 60.1282
      },
      markers: [
        {
          name: "Exit Glacier",
          coordinates: {
            lng: -149.6513,
            lat: 60.1868
          },
          description: "Impressive glacier with accessible hiking trails",
          elevation: "1,880 ft"
        },
        {
          name: "Seward Harbor",
          coordinates: {
            lng: -149.4403,
            lat: 60.1198
          },
          description: "Starting point for whale watching tours"
        }
      ],
      journey: {
        segments: [
          {
            mode: "driving",
            from: "Anchorage",
            to: "Seward",
            distance: 204500,
            duration: 7200,
            geometry: {
              coordinates: [
                [-149.8996, 61.2176],
                [-149.8500, 61.1000],
                [-149.7000, 60.9000],
                [-149.6000, 60.7000],
                [-149.5000, 60.5000],
                [-149.4500, 60.3000],
                [-149.4403, 60.1198]
              ]
            },
            steps: [
              {
                maneuver: {
                  instruction: "Drive from Anchorage to Seward",
                  location: [-149.8996, 61.2176]
                },
                distance: 204500,
                duration: 7200
              }
            ]
          },
          {
            mode: "hiking",
            from: "Seward Harbor",
            to: "Exit Glacier",
            distance: 12000,
            duration: 10800,
            geometry: {
              coordinates: [
                [-149.4403, 60.1198],
                [-149.5000, 60.1300],
                [-149.5500, 60.1500],
                [-149.6000, 60.1600],
                [-149.6513, 60.1868]
              ]
            },
            steps: [
              {
                maneuver: {
                  instruction: "Hike to Exit Glacier",
                  location: [-149.4403, 60.1198]
                },
                distance: 12000,
                duration: 10800
              }
            ],
            terrain: "trail",
            elevationGain: 250
          }
        ],
        totalDistance: 216500,
        totalDuration: 18000,
        bounds: [
          [-149.8996, 60.1198],
          [-149.4403, 61.2176]
        ]
      },
      itinerary: [
        {
          day: 1,
          title: "Arrival in Anchorage",
          description: "Arrive in Anchorage and prepare for your adventure",
          activities: [
            {
              name: "Alaska Native Heritage Center Visit",
              type: "Sightseeing",
              duration: "3 hours",
              description: "Learn about Alaska's indigenous cultures",
              permitRequired: false
            }
          ]
        },
        {
          day: 2,
          title: "Kenai Fjords National Park Day",
          description: "Full-day boat tour and wildlife viewing",
          activities: [
            {
              name: "Wildlife Cruise",
              type: "Sightseeing",
              duration: "6 hours",
              description: "Observe glaciers calving and marine wildlife",
              permitRequired: false,
              outfitters: ["Kenai Fjords Tours"]
            }
          ]
        }
      ]
    },
    {
      id: "fallback-trip-2",
      title: "Montana Backcountry Trek",
      description: "Explore the remote wilderness of Montana on this guided backcountry adventure.",
      whyWeChoseThis: "Perfect for nature enthusiasts who want to disconnect and experience authentic wilderness.",
      difficultyLevel: "Challenging",
      priceEstimate: 3200,
      duration: "7 days",
      location: "Glacier National Park, Montana",
      suggestedGuides: ["Montana Wilderness Outfitters", "Glacier Guides"],
      mapCenter: {
        lng: -113.7871,
        lat: 48.7596
      },
      markers: [
        {
          name: "Logan Pass",
          coordinates: {
            lng: -113.7165,
            lat: 48.6967
          },
          description: "Continental Divide crossing point",
          elevation: "6,646 ft"
        },
        {
          name: "Many Glacier",
          coordinates: {
            lng: -113.6458,
            lat: 48.7968
          },
          description: "Stunning mountain views and hiking trails"
        }
      ],
      journey: {
        segments: [
          {
            mode: "driving",
            from: "Kalispell",
            to: "West Glacier",
            distance: 41000,
            duration: 1800,
            geometry: {
              coordinates: [
                [-114.3165, 48.1919],
                [-114.2000, 48.3000],
                [-114.1000, 48.4000],
                [-114.0000, 48.5000],
                [-113.9748, 48.5223]
              ]
            },
            steps: [
              {
                maneuver: {
                  instruction: "Drive to West Glacier",
                  location: [-114.3165, 48.1919]
                },
                distance: 41000,
                duration: 1800
              }
            ]
          },
          {
            mode: "hiking",
            from: "West Glacier",
            to: "Logan Pass",
            distance: 32000,
            duration: 28800,
            geometry: {
              coordinates: [
                [-113.9748, 48.5223],
                [-113.9000, 48.5500],
                [-113.8500, 48.6000],
                [-113.8000, 48.6500],
                [-113.7165, 48.6967]
              ]
            },
            steps: [
              {
                maneuver: {
                  instruction: "Hike to Logan Pass via Highline Trail",
                  location: [-113.9748, 48.5223]
                },
                distance: 32000,
                duration: 28800
              }
            ],
            terrain: "trail",
            elevationGain: 980
          }
        ],
        totalDistance: 73000,
        totalDuration: 30600,
        bounds: [
          [-114.3165, 48.1919],
          [-113.7165, 48.6967]
        ]
      },
      itinerary: [
        {
          day: 1,
          title: "Arrival in Kalispell",
          description: "Arrive in Kalispell and prepare for your trek",
          activities: [
            {
              name: "Gear Check and Orientation",
              type: "Preparation",
              duration: "2 hours",
              description: "Meet your guides and review gear",
              permitRequired: false
            }
          ]
        },
        {
          day: 2,
          title: "Enter Glacier National Park",
          description: "Begin your journey into the park",
          activities: [
            {
              name: "Highline Trail Trek",
              type: "Hiking",
              duration: "8 hours",
              description: "Experience one of the most scenic trails in the park",
              permitRequired: true,
              permitDetails: "Backcountry camping permit required",
              outfitters: ["Glacier Outfitters"]
            }
          ]
        }
      ]
    }
  ];
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
    const responseData = await callClaudeApi(prompt);
    
    // Return the structured response with cost tracking info
    return new Response(
      JSON.stringify(responseData),
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
        details: error.message,
        costTracking: {
          promptTokens: 0,
          completionTokens: 0, 
          totalTokens: 0,
          estimatedCost: 0,
          inputCostPer1k: CLAUDE_SONNET_INPUT_COST * 1000,
          outputCostPer1k: CLAUDE_SONNET_OUTPUT_COST * 1000,
          error: true
        }
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
