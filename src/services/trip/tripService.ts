
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trips";

export const generateTrips = async (
  prompt: string,
  thinkingCallback?: (steps: string[]) => void
): Promise<Trip[]> => {
  try {
    console.info(`Using gemini model for trip recommendations`);
    console.info(`Calling trip-recommendations edge function with prompt: ${prompt}`);
    
    const { data, error } = await supabase.functions.invoke("trip-recommendations", {
      body: {
        prompt,
        model: "gemini",
      },
    });

    if (error) {
      console.error("Error calling trip-recommendations function:", error);
      throw new Error(`Edge Function Error: ${error.message}`);
    }

    if (!data) {
      console.error("No data returned from trip-recommendations function");
      throw new Error("No data returned from the AI service");
    }

    // Process thinking steps if available
    if (data.thinking && thinkingCallback) {
      thinkingCallback(data.thinking);
    }

    // The response structure should contain trips data from tripData
    const trips = data.tripData?.trip || [];
    return trips;
  } catch (error) {
    console.error("Error generating trips:", error);
    throw new Error(`Edge Function Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Adding the missing fetchTripById function that's imported in TripDetails.tsx
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
