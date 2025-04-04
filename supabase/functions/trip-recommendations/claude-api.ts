import { claudeToolSchema } from "./schema.ts";
import { corsHeaders } from "./cors.ts";

const claudeApiUrl = "https://api.anthropic.com/v1/messages";
const claudeModel = "claude-3-7-sonnet-20250219";

// Get the API key from environment variables
const claudeApiKey = Deno.env.get('my_api_key');

// Helper for Claude API requests
export async function callClaudeApi(prompt: string, existingTrips?: any) {
  try {
    console.log("Calling Claude API with prompt:", prompt);
    console.log("Existing trips provided:", !!existingTrips);
    
    if (!claudeApiKey) {
      console.error("API key is not set in environment variables");
      throw new Error("API key is not set in environment variables");
    }
    
    // Prepare user messages
    const userMessages = [];
    
    // Add the main prompt message
    userMessages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: prompt
        }
      ]
    });
    
    // If modifying existing trips, add context about previous trips
    if (existingTrips) {
      // Add a system message explaining the modification
      userMessages.push({
        role: "assistant", 
        content: [
          {
            type: "text",
            text: "I've created these trips based on your initial request. I'll now modify them according to your additional requirements."
          }
        ]
      });
    }
    
    const payload = {
      model: claudeModel,
      max_tokens: 6000,
      temperature: 1,
      system: "You are an outdoor activity planning assistant. Provide two eco/local-friendly trip options to lesser-known destinations in valid JSON format.\n\nAnalyze user prompts for destination, activities, duration, budget, intensity level, and special requirements.\n\n- Prioritize off-the-beaten-path locations and local operators\n- Consider shoulder-season times\n- Consider congestion\n- Consider preparedness\n- Activities and Itineraries need to consider the time it will take to do that activity, time of day, if you need to camp, and how long to get back.",
      messages: userMessages,
      tools: [claudeToolSchema],
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
    
    // Log thinking steps if available
    if (data.thinking && data.thinking.thinking_steps) {
      console.log("Thinking steps provided:", data.thinking.thinking_steps.length);
      // Log a sample of the first thinking step (to keep logs manageable)
      if (data.thinking.thinking_steps.length > 0) {
        console.log("First thinking step:", data.thinking.thinking_steps[0].text.slice(0, 150) + "...");
      }
    }
    
    if (data.content && data.content.length > 0) {
      // Look for tool use in the response
      const toolUse = data.content.find(item => 
        item.type === 'tool_use' && 
        item.name === 'trip_format'
      );
      
      if (toolUse && toolUse.input) {
        // Parse and return the structured trip data along with thinking steps
        return {
          tripData: toolUse.input,
          thinking: data.thinking?.thinking_steps || []
        };
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
              return {
                tripData: extractedJson,
                thinking: data.thinking?.thinking_steps || []
              };
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
