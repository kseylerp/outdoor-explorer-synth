
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trips";

export const generateTrips = async (
  prompt: string,
  thinkingCallback?: (steps: string[]) => void
): Promise<Trip[]> => {
  try {
    // Get the preferred AI model from localStorage, default to gemini
    const preferredModel = localStorage.getItem('preferredAiModel') as 'claude' | 'gemini' || 'gemini';
    const edgeFunction = preferredModel === 'claude' ? 'claude-recommendations' : 'gemini-recommendations';
    
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

    // Process thinking steps if available
    if (data.thinking && thinkingCallback) {
      thinkingCallback(data.thinking);
    }

    // The response structure should contain trips data from tripData
    const trips = data.tripData?.trip || [];
    
    // Validate the structure of trips
    if (!Array.isArray(trips) || trips.length === 0) {
      console.error("Invalid or empty trips array returned:", trips);
      throw new Error("Invalid trip data returned from the AI service");
    }
    
    console.info(`Successfully generated ${trips.length} trips`);
    return trips;
  } catch (error) {
    console.error("Error generating trips:", error);
    throw new Error(`Edge Function Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Fetch a trip by ID from the saved_trips table
export const fetchTripById = async (id: string): Promise<Trip | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('trip_id', id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching trip by ID:", error);
      throw new Error(`Database Error: ${error.message}`);
    }

    return data ? data as unknown as Trip : null;
  } catch (error) {
    console.error("Error in fetchTripById:", error);
    throw new Error(`Error fetching trip: ${error instanceof Error ? error.message : String(error)}`);
  }
};
