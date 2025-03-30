
import { Anthropic } from "npm:@anthropic-ai/sdk";

// Get the API key from environment variables
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

class ClaudeClient {
  private client: Anthropic;
  
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async generateTripRecommendations(prompt: string): Promise<string> {
    console.log("Generating trip recommendations for prompt:", prompt);
    
    const message = await this.client.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 20000,
      temperature: 1,
      system: "You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations in valid JSON format.\n\nAnalyze user prompts for destination, activities, duration, budget, intensity level, and special requirements.\n\nKey requirements:\n- Prioritize off-the-beaten-path locations and local operators\n- Create separate route segments for multi-modal journeys\n- Include sufficient waypoints to accurately represent trails\n- Ensure all coordinates use [longitude, latitude] format\n- Link each activity to its corresponding route data\n- Generate complete route geometry for MapBox visualization\n",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      tools: [
        {
          type: "custom",
          name: "trip_format",
          description: "Formats the JSON response for the web app.",
          input_schema: this.getTripFormatSchema()
        }
      ]
    });

    // The response from Claude will be the tool output
    const toolOutput = message?.content?.[0]?.tool_use?.output;
    
    // If toolOutput exists, it should be a properly formatted JSON string
    if (toolOutput) {
      try {
        // Parse the JSON to validate it
        JSON.parse(toolOutput);
        return toolOutput;
      } catch (error) {
        console.error("Error parsing tool output:", error);
        throw new Error('Invalid JSON in tool output: ' + error.message);
      }
    } else {
      throw new Error('No tool output received from Claude API');
    }
  }

  private getTripFormatSchema() {
    return {
      type: "object",
      properties: {
        trips: {
          type: "array",
          description: "List of trip recommendations",
          items: {
            type: "object",
            required: [
              "id", "title", "description", "whyWeChoseThis", "difficultyLevel",
              "priceEstimate", "duration", "location", "suggestedGuides",
              "mapCenter", "markers", "journey", "itinerary"
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
                enum: ["Easy", "Moderate", "Challenging", "Difficult", "Expert"],
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
                required: ["lng", "lat"],
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
                  required: ["name", "coordinates", "description"],
                  properties: {
                    name: {
                      type: "string",
                      description: "Name of the point of interest"
                    },
                    coordinates: {
                      type: "object",
                      required: ["lng", "lat"],
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
                required: ["segments", "totalDistance", "totalDuration", "bounds"],
                description: "Journey details for the trip",
                properties: {
                  segments: {
                    type: "array",
                    description: "Segments of the journey",
                    items: {
                      type: "object",
                      required: ["mode", "from", "to", "distance", "duration", "geometry", "steps"],
                      properties: {
                        mode: {
                          type: "string",
                          enum: ["walking", "driving", "cycling", "transit"],
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
                          required: ["coordinates"],
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
                            required: ["maneuver", "distance", "duration"],
                            properties: {
                              maneuver: {
                                type: "object",
                                required: ["instruction", "location"],
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
                          enum: ["trail", "paved", "rocky", "mixed"],
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
                  required: ["day", "title", "description", "activities"],
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
                        required: ["name", "type", "duration", "description", "permitRequired"],
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
      required: ["trips"]
    };
  }
}

// Create and export the Claude client instance
export const claudeClient = new ClaudeClient(anthropicApiKey || '');
