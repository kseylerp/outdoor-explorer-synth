
import { validateTripData } from "./validator.ts";

// Extract JSON from various formats in the Gemini response
function extractJsonFromText(textContent: string) {
  try {
    console.log("Attempting to parse Gemini response JSON");
    
    // First try to extract JSON from code blocks
    const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                      textContent.match(/```\s*([\s\S]*?)\s*```/);
                      
    if (jsonMatch && jsonMatch[1]) {
      console.log("Found JSON code block in response");
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (parseError) {
        console.error("Error parsing JSON from code block:", parseError);
        throw new Error(`JSON parse error in code block: ${parseError.message}`);
      }
    } 
    // If no code blocks, try to extract JSON directly
    else if (textContent.includes('"trip":')) {
      console.log("Trying to find JSON object in plain text");
      const jsonObjectMatch = textContent.match(/\{[\s\S]*"trip"[\s\S]*\}/);
      if (jsonObjectMatch) {
        console.log("Found JSON object in text");
        try {
          return JSON.parse(jsonObjectMatch[0]);
        } catch (parseError) {
          console.error("Error parsing JSON from matched object:", parseError);
          throw new Error(`JSON parse error in matched object: ${parseError.message}`);
        }
      } else {
        throw new Error("Could not locate a valid JSON object with 'trip' key");
      }
    }
    // Last resort - try parsing the entire text
    else {
      console.log("Attempting to parse entire response as JSON");
      try {
        return JSON.parse(textContent);
      } catch (parseError) {
        console.error("Error parsing entire text as JSON:", parseError);
        throw new Error(`Full text JSON parse error: ${parseError.message}`);
      }
    }
  } catch (error) {
    console.error("Error extracting JSON from text:", error);
    throw error;
  }
}

// Parse the Gemini API response and extract trip data
export function parseGeminiResponse(data: any, thinkingSteps: string[]) {
  let tripData = null;
  let rawTextContent = '';
  
  if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
    const textContent = data.candidates[0].content.parts[0].text;
    rawTextContent = textContent;
    
    if (textContent) {
      try {
        tripData = extractJsonFromText(textContent);
        tripData = validateTripData(tripData);
      } catch (error) {
        console.error("Error processing Gemini response:", error);
        throw new Error(`${error.message} | Raw content: ${textContent.substring(0, 200)}...`);
      }
    } else {
      throw new Error("No text content in Gemini response");
    }
  } else {
    throw new Error("Invalid response structure from Gemini API - missing candidates or content parts");
  }
  
  return {
    thinking: thinkingSteps,
    tripData: tripData,
    rawResponse: rawTextContent // Include the full raw response for better debugging
  };
}
