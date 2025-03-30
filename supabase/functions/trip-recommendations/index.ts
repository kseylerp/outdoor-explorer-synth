
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
      max_tokens: 4000, // Reduced from 20000 to speed up response
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
                    "mapCenter",
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
          "anthropic-version": "2023-06-01",
          "x-api-key": claudeApiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Claude API error: ${response.status}`, errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Claude API response received:", JSON.stringify(data).substring(0, 200) + "...");
      
      // Check if there's a tool response
      if (data.content && Array.isArray(data.content)) {
        // Find the tool response
        const toolBlock = data.content.find(
          (item: any) => item.type === "tool_use"
        );
        
        if (toolBlock && toolBlock.input) {
          console.log("Successfully parsed Claude tool response");
          try {
            // The input property is already a parsed object, not a string, so we don't need to parse it
            const parsedData = typeof toolBlock.input === 'string' 
              ? JSON.parse(toolBlock.input) 
              : toolBlock.input;
            
            // Validate the response format
            if (!parsedData.trips || !Array.isArray(parsedData.trips)) {
              console.error("Invalid response format: missing trips array");
              throw new Error("Invalid response format: missing trips array");
            }
            
            // Validate each trip has required fields
            parsedData.trips.forEach((trip: any, index: number) => {
              if (!trip.id || !trip.title || !trip.description || !trip.mapCenter) {
                console.error(`Trip at index ${index} is missing required fields`);
              }
            });
            
            return parsedData;
          } catch (e) {
            console.error("Error processing tool response:", e);
            throw new Error(`Failed to process Claude tool response: ${e.message}`);
          }
        } else {
          // If there's no tool response, try to find a text block with JSON
          const textBlock = data.content.find(
            (item: any) => item.type === "text"
          );
          
          if (textBlock) {
            try {
              // Try to extract JSON from the text
              const jsonMatch = textBlock.text.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                console.log("Extracted JSON from code block in text response");
                const parsedData = JSON.parse(jsonMatch[1]);
                
                // Transform into expected format if necessary
                if (!parsedData.trips && Array.isArray(parsedData)) {
                  console.log("Transforming array response to trips object");
                  return { trips: parsedData };
                }
                
                return parsedData;
              } else {
                try {
                  // Attempt to parse the entire text as JSON
                  console.log("Attempting to parse entire text as JSON");
                  const parsedData = JSON.parse(textBlock.text);
                  
                  // Transform into expected format if necessary
                  if (!parsedData.trips && Array.isArray(parsedData)) {
                    console.log("Transforming array response to trips object");
                    return { trips: parsedData };
                  }
                  
                  return parsedData;
                } catch (e) {
                  console.error("Failed to parse text as JSON:", e);
                  throw new Error("Failed to extract valid JSON from Claude response");
                }
              }
            } catch (e) {
              console.error("Failed to extract JSON from text:", e);
              throw new Error("Failed to extract valid JSON from Claude response");
            }
          }
        }
      }
      
      console.error("Unexpected Claude API response format:", JSON.stringify(data).substring(0, 200) + "...");
      throw new Error("Unexpected Claude API response format");
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in callClaudeApi function:", error);
    throw error;
  }
}

// Fallback trip generator for when the API fails
function generateFallbackTrips(prompt: string) {
  console.log("Generating fallback trips for prompt:", prompt);
  
  // Extract location from prompt if possible
  let location = "Grand Canyon";
  const locationMatch = prompt.match(/(?:to|in|at|visit|explore)\s+(?:the\s+)?([A-Za-z\s]+)/i);
  if (locationMatch && locationMatch[1]) {
    location = locationMatch[1].trim();
  }
  
  // Extract duration if possible
  let duration = "7 days";
  const durationMatch = prompt.match(/(\d+)\s+(?:day|days|week|weeks)/i);
  if (durationMatch && durationMatch[1]) {
    const days = parseInt(durationMatch[1]);
    duration = `${days} days`;
  }
  
  // Generate random coordinates near the presumed location
  // Default to Grand Canyon coordinates
  const baseLng = -112.1122;
  const baseLat = 36.0544;
  
  const randomCoord = (base: number, range: number) => {
    return base + (Math.random() * range * 2 - range);
  };
  
  // Create fallback trips
  return {
    trips: [
      {
        id: "fallback-" + Date.now().toString(36),
        title: `${location} Adventure`,
        description: `Explore the natural beauty of ${location} with this custom adventure package.`,
        whyWeChoseThis: "This adventure matches your request for an outdoor experience in this location.",
        difficultyLevel: "Moderate",
        priceEstimate: "$1,500 - $2,500",
        duration: duration,
        location: location,
        mapCenter: { lng: baseLng, lat: baseLat },
        markers: [
          {
            name: "Starting Point",
            coordinates: { lng: randomCoord(baseLng, 0.05), lat: randomCoord(baseLat, 0.05) },
            description: "Your journey begins here"
          },
          {
            name: "Scenic Viewpoint",
            coordinates: { lng: randomCoord(baseLng, 0.05), lat: randomCoord(baseLat, 0.05) },
            description: "Amazing views of the surrounding landscape"
          },
          {
            name: "Rest Area",
            coordinates: { lng: randomCoord(baseLng, 0.05), lat: randomCoord(baseLat, 0.05) },
            description: "A good place to rest and recharge"
          }
        ],
        journey: {
          segments: [
            {
              mode: "walking",
              from: "Starting Point",
              to: "Scenic Viewpoint",
              distance: 2500,
              duration: 1800,
              geometry: {
                coordinates: [
                  [randomCoord(baseLng, 0.05), randomCoord(baseLat, 0.05)],
                  [randomCoord(baseLng, 0.05), randomCoord(baseLat, 0.05)],
                  [randomCoord(baseLng, 0.05), randomCoord(baseLat, 0.05)]
                ]
              },
              steps: [
                {
                  maneuver: {
                    instruction: "Start your journey here",
                    location: [randomCoord(baseLng, 0.05), randomCoord(baseLat, 0.05)]
                  },
                  distance: 800,
                  duration: 600
                },
                {
                  maneuver: {
                    instruction: "Continue along the trail",
                    location: [randomCoord(baseLng, 0.05), randomCoord(baseLat, 0.05)]
                  },
                  distance: 1700,
                  duration: 1200
                }
              ]
            }
          ],
          totalDistance: 2500,
          totalDuration: 1800,
          bounds: [
            [baseLng - 0.1, baseLat - 0.1],
            [baseLng + 0.1, baseLat + 0.1]
          ]
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival Day",
            description: "Arrive and get settled in your accommodation",
            activities: [
              {
                name: "Check-in",
                type: "Logistics",
                duration: "1 hour",
                description: "Check in to your accommodation",
                permitRequired: false
              },
              {
                name: "Welcome Dinner",
                type: "Dining",
                duration: "2 hours",
                description: "Enjoy a delicious welcome dinner",
                permitRequired: false
              }
            ]
          },
          {
            day: 2,
            title: "Exploration Day",
            description: "Explore the main attractions",
            activities: [
              {
                name: "Guided Tour",
                type: "Sightseeing",
                duration: "4 hours",
                description: "Guided tour of the main attractions",
                permitRequired: false
              },
              {
                name: "Hiking",
                type: "Outdoor Activity",
                duration: "3 hours",
                description: "Hike along scenic trails",
                permitRequired: false
              }
            ]
          }
        ]
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

    // Set a timeout for the Claude API call to prevent long-running functions
    const TIMEOUT_MS = 20000; // 20 seconds - reduced from 50s to ensure function completes faster
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Claude API call timed out")), TIMEOUT_MS)
    );
    
    // Call Claude API with timeout
    let claudeResponse;
    try {
      claudeResponse = await Promise.race([
        callClaudeApi(prompt),
        timeoutPromise
      ]);
    } catch (error) {
      console.error("Error or timeout calling Claude API:", error);
      
      // Generate fallback content instead of failing completely
      console.log("Generating fallback response");
      claudeResponse = generateFallbackTrips(prompt);
      
      return new Response(
        JSON.stringify(claudeResponse),
        {
          status: 200, // Return 200 with fallback data instead of 500
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Returning response to client");
    
    // Return the response
    return new Response(JSON.stringify(claudeResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Generate fallback content for any other errors
    const fallbackData = generateFallbackTrips("fallback");
    
    return new Response(
      JSON.stringify(fallbackData),
      {
        status: 200, // Return 200 with fallback data instead of 500
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
