
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trips";
import { jsonToCoordinates, jsonToMarkers, jsonToJourney, jsonToItinerary } from "./tripMappers";

export const generateTrips = async (
  prompt: string,
  thinkingCallback?: (steps: string[]) => void
): Promise<Trip[]> => {
  try {
    // We're only using gemini-recommendations (which will be updated to use OpenAI)
    const edgeFunction = 'gemini-recommendations';
    
    console.info(`Using OpenAI model for trip recommendations`);
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
    
    // Make sure descriptions are properly set
    trips.forEach((trip, index) => {
      if (!trip.description || trip.description.length < 10) {
        console.warn(`Trip ${index} has missing or short description:`, trip.description);
        
        // Try to extract description from whyWeChoseThis if needed
        if (trip.whyWeChoseThis && trip.whyWeChoseThis.length > 50) {
          console.log(`Using whyWeChoseThis as fallback for description in trip ${index}`);
          trip.description = trip.whyWeChoseThis;
        }
      }
      
      // Ensure ID is set
      if (!trip.id) {
        trip.id = `trip-${Date.now()}-${index}`;
      }
    });
    
    return trips;
  } catch (error) {
    console.error("Error generating trips:", error);
    throw new Error(`${error instanceof Error ? error.message : String(error)}`);
  }
};

// Function to enhance trip data from raw response
function enhanceTripDataFromRawResponse(trips: Trip[], rawResponse: string) {
  try {
    // Try to parse the raw response
    let rawData: any = null;
    
    try {
      // First attempt: Try to parse the entire raw response
      rawData = JSON.parse(rawResponse);
    } catch (parseError) {
      console.log("Could not parse entire raw response, trying to extract JSON");
      
      // Second attempt: Try to extract JSON from the raw response
      const jsonMatch = rawResponse.match(/\{[\s\S]*"trip"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          rawData = JSON.parse(jsonMatch[0]);
        } catch (extractError) {
          console.warn("Could not extract JSON from raw response:", extractError);
        }
      }
    }
    
    if (rawData && rawData.trip && Array.isArray(rawData.trip)) {
      console.log("Successfully extracted trip data from raw response");
      
      // Enhance each trip with data from raw response
      for (let i = 0; i < trips.length; i++) {
        if (i < rawData.trip.length) {
          const rawTrip = rawData.trip[i];
          
          // Enhance itinerary
          if (rawTrip.itinerary && (!trips[i].itinerary || trips[i].itinerary.length === 0)) {
            console.log(`Enhancing trip ${i} with itinerary from raw response`);
            trips[i].itinerary = rawTrip.itinerary;
          }
          
          // Enhance journey
          if (rawTrip.journey && (!trips[i].journey || !trips[i].journey.segments || trips[i].journey.segments.length === 0)) {
            console.log(`Enhancing trip ${i} with journey from raw response`);
            trips[i].journey = rawTrip.journey;
          }
          
          // Enhance markers
          if (rawTrip.markers && (!trips[i].markers || trips[i].markers.length === 0)) {
            console.log(`Enhancing trip ${i} with markers from raw response`);
            trips[i].markers = rawTrip.markers;
          }
          
          // Ensure all required fields are present and have content
          if (!trips[i].description || trips[i].description.trim().length === 0) {
            console.log(`Trip ${i} missing description, trying to fix`);
            if (rawTrip.description && rawTrip.description.trim().length > 0) {
              trips[i].description = rawTrip.description;
            }
          }
          
          if (!trips[i].whyWeChoseThis && rawTrip.whyWeChoseThis) {
            trips[i].whyWeChoseThis = rawTrip.whyWeChoseThis;
          }
          
          if (!trips[i].difficultyLevel && rawTrip.difficultyLevel) {
            trips[i].difficultyLevel = rawTrip.difficultyLevel;
          }
          
          if (!trips[i].priceEstimate && rawTrip.priceEstimate) {
            trips[i].priceEstimate = rawTrip.priceEstimate;
          }
        }
      }
    }
  } catch (error) {
    console.warn("Error enhancing trip data from raw response:", error);
    // Don't throw, just log the warning - this is an enhancement, not critical
  }
}

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
