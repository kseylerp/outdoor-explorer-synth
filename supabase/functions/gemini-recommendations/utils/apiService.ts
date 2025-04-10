
import { corsHeaders } from "./corsUtils.ts";
import { createGeminiPrompt } from "./promptUtils.ts";
import { parseGeminiResponse } from "./responseParser.ts";
import { getThinkingSteps } from "./thinkingUtils.ts";

// Get the API key from environment variables
const geminiApiKey = Deno.env.get('YUGEN_TO_GEMINI_API_KEY');
// The API URL for Gemini
const geminiApiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

// Create the request payload for Gemini API
function createGeminiRequestPayload(userPrompt: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: createGeminiPrompt(userPrompt)
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
}

// Call the Gemini API with the given prompt
export async function callGeminiApi(prompt: string) {
  try {
    console.log("Calling Gemini API with prompt:", prompt);
    
    if (!geminiApiKey) {
      console.error("Gemini API key not configured");
      throw new Error("API_KEY_MISSING: Gemini API key is not configured. Please set the YUGEN_TO_GEMINI_API_KEY secret in your Supabase project.");
    }
    
    const payload = createGeminiRequestPayload(prompt);
    const urlWithKey = `${geminiApiUrl}?key=${geminiApiKey}`;
    
    console.log("Making request to Gemini API");
    
    const response = await fetch(urlWithKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    
    const thinkingSteps = getThinkingSteps();
    return parseGeminiResponse(data, thinkingSteps);
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}
