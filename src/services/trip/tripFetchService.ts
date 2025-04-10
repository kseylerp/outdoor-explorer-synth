
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trips";
import { jsonToCoordinates, jsonToMarkers, jsonToJourney, jsonToItinerary } from './tripMappers';

/**
 * Fetch a trip by ID from the saved_trips table
 */
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
