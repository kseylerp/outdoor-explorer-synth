
// Define the schema for the Claude API tool
export const claudeToolSchema = {
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
};
