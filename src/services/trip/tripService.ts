
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

    // If the response contains an error object, throw it
    if (data.error) {
      console.error(`Error in ${edgeFunction} response:`, data);
      throw new Error(`AI Service Error: ${data.details || data.error}`);
    }

    // Process thinking steps if available
    if (data.thinking && thinkingCallback) {
      thinkingCallback(data.thinking);
    }

    // The response structure should contain trips data from tripData
    const trips = data.tripData?.trip || [];
    
    // Check for raw response (debugging info)
    if (data.rawResponse) {
      console.info("Raw response excerpt:", data.rawResponse);
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
    
    // Verify all required trip fields exist
    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      const missingFields = [];
      
      if (!trip.id) missingFields.push("id");
      if (!trip.title) missingFields.push("title");
      if (!trip.description) missingFields.push("description");
      if (!trip.whyWeChoseThis) missingFields.push("whyWeChoseThis");
      if (!trip.difficultyLevel) missingFields.push("difficultyLevel");
      if (trip.priceEstimate === undefined) missingFields.push("priceEstimate");
      if (!trip.duration) missingFields.push("duration");
      if (!trip.location) missingFields.push("location");
      if (!trip.mapCenter) missingFields.push("mapCenter");
      if (!trip.itinerary) missingFields.push("itinerary");
      
      if (missingFields.length > 0) {
        throw new Error(`Trip at index ${i} is missing required fields: ${missingFields.join(", ")}`);
      }
      
      // Process duration string to get number of days
      const durationMatch = trip.duration.match(/(\d+)\s*days?/i);
      const expectedDays = durationMatch ? parseInt(durationMatch[1]) : 0;
      
      // Check if all days are present in the itinerary
      if (expectedDays > 0 && trip.itinerary.length < expectedDays) {
        console.warn(
          `Trip "${trip.title}" duration is ${trip.duration} but only has ${trip.itinerary.length} days in the itinerary. ` +
          `This may indicate truncated output from the AI model.`
        );
        
        // Ensure day numbers are consecutive
        const existingDays = new Set(trip.itinerary.map(d => d.day));
        for (let day = 1; day <= expectedDays; day++) {
          if (!existingDays.has(day)) {
            console.warn(`Day ${day} is missing from the itinerary.`);
          }
        }
      }
    }
    
    console.info(`Successfully generated ${trips.length} trips`);
    return trips;
  } catch (error) {
    console.error("Error generating trips:", error);
    throw new Error(`${error instanceof Error ? error.message : String(error)}`);
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

    if (data) {
      // Add logging to see what itinerary data we're getting
      console.log("Trip itinerary days:", data.itinerary?.length || 0);
      console.log("Trip duration:", data.duration);
      
      // Extract duration days from string
      const durationMatch = data.duration?.match(/(\d+)\s*days?/i);
      const expectedDays = durationMatch ? parseInt(durationMatch[1]) : 0;
      
      if (expectedDays > 0) {
        console.log("Expected days from duration:", expectedDays);
      }
    }

    return data ? data as unknown as Trip : null;
  } catch (error) {
    console.error("Error in fetchTripById:", error);
    throw new Error(`Error fetching trip: ${error instanceof Error ? error.message : String(error)}`);
  }
};
