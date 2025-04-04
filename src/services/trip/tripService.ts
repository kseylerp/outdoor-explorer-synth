import { supabase } from "@/supabase";
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

    // Return the trips from the response
    return data.trips || [];
  } catch (error) {
    console.error("Error generating trips:", error);
    throw new Error(`Edge Function Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};
