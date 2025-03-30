
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
          console.log("Found tool_use response from Claude");
          try {
            // The input property is already a parsed object, not a string, so we don't need to parse it
            const parsedData = typeof toolBlock.input === 'string' 
              ? JSON.parse(toolBlock.input) 
              : toolBlock.input;
            
            // Validate the response format
            if (!parsedData.trips || !Array.isArray(parsedData.trips)) {
              console.error("Invalid response format in tool_use: missing trips array");
              // Try to extract trips data from the tool response itself
              if (parsedData && Array.isArray(parsedData)) {
                console.log("Found array in tool response, transforming to trips format");
                return { trips: parsedData };
              }
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
          console.log("No tool_use response found, looking for JSON in text blocks");
          const textBlock = data.content.find(
            (item: any) => item.type === "text"
          );
          
          if (textBlock) {
            try {
              console.log("Found text block, attempting to extract JSON");
              // Try to extract JSON from the text
              const jsonMatch = textBlock.text.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                console.log("Extracted JSON from code block in text response");
                try {
                  const parsedData = JSON.parse(jsonMatch[1]);
                  
                  // Transform into expected format if necessary
                  if (parsedData && !parsedData.trips && Array.isArray(parsedData)) {
                    console.log("Transforming array response to trips object");
                    return { trips: parsedData };
                  } else if (parsedData && !parsedData.trips && typeof parsedData === 'object') {
                    // If it's a single trip object
                    console.log("Found single trip object, wrapping in trips array");
                    return { trips: [parsedData] };
                  }
                  
                  // Check if trips property exists and is an array
                  if (parsedData && parsedData.trips && Array.isArray(parsedData.trips)) {
                    return parsedData;
                  }
                  
                  console.error("JSON found but doesn't match expected format");
                  throw new Error("Invalid response format: JSON doesn't contain trips array");
                } catch (e) {
                  console.error("Failed to parse extracted JSON:", e);
                  throw new Error("Failed to parse JSON from Claude response");
                }
              } else {
                // No JSON code block, attempt to parse the entire text as JSON
                console.log("No JSON code block found, attempting to parse entire text as JSON");
                try {
                  // Use a regex to find any JSON-like structure in the text
                  const potentialJsonMatch = textBlock.text.match(/(\{[\s\S]*\})/);
                  let jsonText = potentialJsonMatch ? potentialJsonMatch[1] : textBlock.text;
                  
                  // Clean up the text by removing any non-JSON characters at the beginning/end
                  jsonText = jsonText.replace(/^[^{\[]+/, '').replace(/[^}\]]+$/, '');
                  
                  const parsedData = JSON.parse(jsonText);
                  
                  // Transform into expected format if necessary
                  if (!parsedData.trips && Array.isArray(parsedData)) {
                    console.log("Transforming array response to trips object");
                    return { trips: parsedData };
                  } else if (!parsedData.trips && typeof parsedData === 'object') {
                    // If it's a single trip object
                    console.log("Found single trip object, wrapping in trips array");
                    return { trips: [parsedData] };
                  }
                  
                  // Check if trips property exists and is an array
                  if (parsedData.trips && Array.isArray(parsedData.trips)) {
                    return parsedData;
                  }
                  
                  console.error("Text contains JSON but not in expected format");
                  throw new Error("Invalid response format: text doesn't contain trips array");
                } catch (e) {
                  console.error("Failed to parse text as JSON:", e);
                  
                  // Last resort: Try to generate a structured trip from the text content
                  console.log("Attempting to create structured trip from text content");
                  const location = extractLocationFromText(textBlock.text);
                  const duration = extractDurationFromText(textBlock.text);
                  const activities = extractActivitiesFromText(textBlock.text);
                  
                  // Create a structured trip from the extracted information
                  const structuredTrip = {
                    trips: [
                      {
                        id: "generated-" + Date.now(),
                        title: `Trip to ${location}`,
                        description: textBlock.text.substring(0, 200) + "...",
                        whyWeChoseThis: "Based on your request, we've created this itinerary that matches your preferences.",
                        difficultyLevel: "Moderate",
                        priceEstimate: "$$ - $$$",
                        duration: duration || "7 days",
                        location: location,
                        mapCenter: getCoordinatesForLocation(location),
                        itinerary: generateItineraryFromActivities(activities, duration)
                      }
                    ]
                  };
                  
                  console.log("Created structured trip from text content");
                  return structuredTrip;
                }
              }
            } catch (e) {
              console.error("Failed to extract JSON from text:", e);
              throw new Error("Failed to extract valid JSON from Claude response");
            }
          } else {
            console.error("No text or tool_use content found in Claude response");
            throw new Error("Unexpected Claude API response format: no usable content");
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

// Helper functions for extracting information from text
function extractLocationFromText(text: string): string {
  // Try to extract location mentioned after "to", "in", or "at"
  const locationRegex = /(?:to|in|at|visit|explore)\s+(?:the\s+)?([A-Za-z\s,]+)/i;
  const match = text.match(locationRegex);
  
  if (match && match[1]) {
    return match[1].trim().replace(/^(the|go to the)\s+/i, '');
  }
  
  // Fallback to looking for any capitalized place names
  const placeNameRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  const placeMatches = [...text.matchAll(placeNameRegex)];
  
  if (placeMatches.length > 0) {
    // Filter out common non-location words that might be capitalized
    const commonWords = ["I", "You", "We", "They", "The", "A", "An", "And", "But", "Or", "For"];
    const filteredMatches = placeMatches.filter(m => !commonWords.includes(m[1]));
    
    if (filteredMatches.length > 0) {
      return filteredMatches[0][1];
    }
  }
  
  return "Unknown Location";
}

function extractDurationFromText(text: string): string {
  const durationRegex = /(\d+)\s+(?:day|days|week|weeks)/i;
  const match = text.match(durationRegex);
  
  if (match && match[1]) {
    const number = parseInt(match[1]);
    if (match[0].toLowerCase().includes("week")) {
      return `${number * 7} days`;
    }
    return `${number} day${number > 1 ? 's' : ''}`;
  }
  
  return "7 days";
}

function extractActivitiesFromText(text: string): string[] {
  const activities = [];
  
  // Common outdoor activities to look for
  const commonActivities = [
    "hiking", "trekking", "camping", "swimming", "kayaking", "canoeing", 
    "rafting", "skiing", "snowboarding", "climbing", "biking", "cycling",
    "fishing", "sailing", "snorkeling", "diving", "surfing", "wildlife viewing",
    "bird watching", "photography", "sightseeing", "tour", "exploring"
  ];
  
  for (const activity of commonActivities) {
    if (text.toLowerCase().includes(activity)) {
      activities.push(activity);
    }
  }
  
  return activities.length > 0 ? activities : ["exploring", "sightseeing"];
}

function getCoordinatesForLocation(location: string): { lng: number, lat: number } {
  // Simple mapping of some common locations
  const locationCoordinates: Record<string, [number, number]> = {
    "grand canyon": [-112.1122, 36.0544],
    "yosemite": [-119.5383, 37.8651],
    "yellowstone": [-110.5885, 44.4280],
    "taiwan": [121.5654, 25.0330],
    "japan": [138.2529, 36.2048],
    "new york": [-74.0060, 40.7128],
    "london": [-0.1278, 51.5074],
    "paris": [2.3522, 48.8566],
    "tokyo": [139.6503, 35.6762],
    "sydney": [151.2093, -33.8688]
  };
  
  // Check if the location is in our mapping
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (location.toLowerCase().includes(key)) {
      return { lng: coords[0], lat: coords[1] };
    }
  }
  
  // Default to a central US location if not found
  return { lng: -95.7129, lat: 37.0902 };
}

function generateItineraryFromActivities(activities: string[], duration: string): any[] {
  // Parse duration to number of days
  const daysMatch = duration.match(/(\d+)/);
  const numberOfDays = daysMatch ? parseInt(daysMatch[1]) : 7;
  
  // Create a simple itinerary based on the number of days and activities
  const itinerary = [];
  
  for (let day = 1; day <= numberOfDays; day++) {
    if (day === 1) {
      // First day is always arrival
      itinerary.push({
        day: 1,
        title: "Arrival Day",
        description: "Arrive and get settled in your accommodation",
        activities: [
          {
            name: "Check-in",
            type: "Accommodation",
            duration: "1 hour",
            description: "Check in to your accommodation and freshen up",
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
      });
    } else if (day === numberOfDays) {
      // Last day is always departure
      itinerary.push({
        day: day,
        title: "Departure Day",
        description: "Last-minute activities before departure",
        activities: [
          {
            name: "Morning activity",
            type: activities.length > 0 ? capitalizeFirstLetter(activities[0]) : "Sightseeing",
            duration: "3 hours",
            description: `Final ${activities.length > 0 ? activities[0] : "sightseeing"} experience`,
            permitRequired: false
          },
          {
            name: "Departure",
            type: "Transportation",
            duration: "3 hours",
            description: "Check out and departure arrangements",
            permitRequired: false
          }
        ]
      });
    } else {
      // Middle days are filled with activities
      const dayActivities = [];
      const usableActivities = activities.length > 0 ? activities : ["exploring", "sightseeing"];
      
      // Morning activity
      const morningActivityIndex = (day - 2) % usableActivities.length;
      dayActivities.push({
        name: `Morning ${capitalizeFirstLetter(usableActivities[morningActivityIndex])}`,
        type: capitalizeFirstLetter(usableActivities[morningActivityIndex]),
        duration: "3 hours",
        description: `Morning ${usableActivities[morningActivityIndex]} adventure`,
        permitRequired: false
      });
      
      // Afternoon activity
      const afternoonActivityIndex = (day - 2 + 1) % usableActivities.length;
      dayActivities.push({
        name: `Afternoon ${capitalizeFirstLetter(usableActivities[afternoonActivityIndex])}`,
        type: capitalizeFirstLetter(usableActivities[afternoonActivityIndex]),
        duration: "4 hours",
        description: `Afternoon ${usableActivities[afternoonActivityIndex]} experience`,
        permitRequired: false
      });
      
      itinerary.push({
        day: day,
        title: `Day ${day} Adventures`,
        description: `Enjoy a full day of ${usableActivities.join(" and ")}`,
        activities: dayActivities
      });
    }
  }
  
  return itinerary;
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    try {
      const claudeResponse = await callClaudeApi(prompt);
      
      console.log("Returning response to client");
      
      // Return the response
      return new Response(JSON.stringify(claudeResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error calling Claude API:", error);
      
      // Return an error response
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate trip recommendations", 
          details: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
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
