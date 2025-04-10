
import { Trip } from "@/types/trips";

/**
 * Enhances trip data from raw API response
 */
export function enhanceTripDataFromRawResponse(trips: Trip[], rawResponse: string) {
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
          
          // Ensure all required fields are present
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
