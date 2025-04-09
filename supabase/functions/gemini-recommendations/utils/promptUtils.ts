
// Create the prompt for Gemini API
export function createGeminiPrompt(userPrompt: string) {
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
