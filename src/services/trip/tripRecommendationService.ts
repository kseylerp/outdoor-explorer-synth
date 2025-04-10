
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trips";
import { enhanceTripDataFromRawResponse } from './tripEnhancementService';

/**
 * Generates trip recommendations based on user prompt using AI
 */
export const generateTrips = async (
  prompt: string,
  thinkingCallback?: (steps: string[]) => void
): Promise<Trip[]> => {
  try {
    // Get the preferred AI model from localStorage, default to gemini
    const preferredModel = 'gemini'; // Always use Gemini as Claude is temporarily disabled
    const edgeFunction = preferredModel === 'gemini' ? 'gemini-recommendations' : 'claude-recommendations';
    
    console.info(`Using ${preferredModel} model for trip recommendations`);
    console.info(`Calling ${edgeFunction} edge function with prompt: ${prompt}`);
    
    const { data, error } = await supabase.functions.invoke(edgeFunction, {
      body: { prompt },
    });

    if (error) {
      console.error(`Error calling ${edgeFunction} function:`, error);
      throw new Error(`Edge Function Error: ${error.message}`);
    }

    if (!data) {
      console.error(`No data returned from ${edgeFunction} function`);
      throw new Error("No data returned from the AI service");
    }

    // Log the complete raw API response to see all available data
    console.log("Complete AI API Response:", JSON.stringify(data, null, 2));

    // If the response contains an error object, throw it
    if (data.error) {
      console.error(`Error in ${edgeFunction} response:`, data);
      throw new Error(`AI Service Error: ${data.details || data.error}`);
    }

    // Process thinking steps if available
    if (data.thinking && thinkingCallback) {
      thinkingCallback(data.thinking);
      console.log("Thinking steps processed and sent to UI");
    }

    // The response structure should contain trips data from tripData
    const trips = data.tripData?.trip || [];
    
    // Check for raw response and enhance trip data if needed
    if (data.rawResponse) {
      console.info("Raw response available, trying to enhance trip data with it");
      
      if (trips.length > 0) {
        // Enhanced itinerary extraction
        enhanceTripDataFromRawResponse(trips, data.rawResponse);
      }
    }
    
    // Validate the structure of trips with detailed error messages
    if (!Array.isArray(trips)) {
      console.error("Invalid trips data returned:", trips);
      throw new Error("AI returned invalid trip data: trips is not an array");
    }
    
    if (trips.length === 0) {
      console.error("Empty trips array returned");
      throw new Error("AI returned empty trip data: no trips were generated");
    }
    
    // Log complete trip data to ensure we're capturing everything
    console.log("Complete trip data from API:", JSON.stringify(trips, null, 2));
    
    return trips;
  } catch (error) {
    console.error("Error generating trips:", error);
    throw new Error(`${error instanceof Error ? error.message : String(error)}`);
  }
};
