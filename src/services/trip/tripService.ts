
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trips";
import { jsonToCoordinates, jsonToMarkers, jsonToJourney, jsonToItinerary } from "./tripMappers";

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
    }

    // The response structure should contain trips data from tripData
    const trips = data.tripData?.trip || [];
    
    // Check for raw response (debugging info)
    if (data.rawResponse) {
      console.info("Raw response:", data.rawResponse);
      
      // Attempt to parse any additional data from the raw response if the itinerary is incomplete
      try {
        if (data.rawResponse && trips.length > 0 && (!trips[0].itinerary || trips[0].itinerary.length < 2)) {
          console.log("Attempting to extract more complete itinerary data from raw response");
          const rawResponseJson = JSON.parse(data.rawResponse);
          if (rawResponseJson && rawResponseJson.trip && rawResponseJson.trip[0] && rawResponseJson.trip[0].itinerary) {
            console.log("Found itinerary in raw response:", rawResponseJson.trip[0].itinerary);
            trips[0].itinerary = rawResponseJson.trip[0].itinerary;
          }
        }
      } catch (parseError) {
        console.warn("Could not extract additional data from raw response:", parseError);
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
      // Add detailed logging to inspect the data structure
      console.log("Trip data from database:", data);
      
      // Log details about the itinerary data specifically
      console.log("Itinerary data type:", typeof data.itinerary);
      if (typeof data.itinerary === 'string') {
        console.log("Itinerary appears to be a string, will try to parse it");
      } else if (Array.isArray(data.itinerary)) {
        console.log("Itinerary is already an array with", data.itinerary.length, "items");
      } else if (data.itinerary === null) {
        console.log("Itinerary is null");
      } else {
        console.log("Itinerary is an object:", data.itinerary);
      }
      
      // Extract duration days from string
      const durationMatch = data.duration?.match(/(\d+)\s*days?/i);
      const expectedDays = durationMatch ? parseInt(durationMatch[1]) : 0;
      
      if (expectedDays > 0) {
        console.log("Expected days from duration:", expectedDays);
      }

      // Convert journey data for inspection
      const journey = jsonToJourney(data.journey);
      console.log("Converted journey:", journey);
      
      // Convert itinerary data for inspection
      const itinerary = jsonToItinerary(data.itinerary);
      console.log("Converted itinerary:", itinerary);
      
      // Create a Trip object with proper type conversions
      const trip: Trip = {
        id: data.trip_id,
        title: data.title,
        description: data.description || '',
        whyWeChoseThis: 'Handpicked for a unique adventure experience', // Default value since it's not in the database
        difficultyLevel: data.difficulty_level || '',
        priceEstimate: data.price_estimate || 0,
        duration: data.duration || '',
        location: data.location || '',
        mapCenter: jsonToCoordinates(data.map_center),
        markers: jsonToMarkers(data.markers),
        journey: jsonToJourney(data.journey),
        itinerary: jsonToItinerary(data.itinerary),
      };

      return trip;
    }

    return null;
  } catch (error) {
    console.error("Error in fetchTripById:", error);
    throw new Error(`Error fetching trip: ${error instanceof Error ? error.message : String(error)}`);
  }
};
