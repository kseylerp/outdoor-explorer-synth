
import { Trip } from '@/types/trips';
import { 
  generateUniqueId, 
  validateItinerary, 
  validateJourneySegments 
} from './validation';

// Function to validate and transform trip data
export const validateAndTransformTrip = (trip: any): Trip => {
  // Ensure trip has an ID
  if (!trip.id) {
    trip.id = generateUniqueId();
  }
  
  // Validate and set default values for required fields
  const validatedTrip: Trip = {
    id: trip.id,
    title: trip.title || 'Unnamed Adventure',
    description: trip.description || 'No description available',
    whyWeChoseThis: trip.whyWeChoseThis || 'This adventure matches your preferences',
    difficultyLevel: trip.difficultyLevel || 'Moderate',
    priceEstimate: trip.priceEstimate || 'Price information unavailable',
    duration: trip.duration || 'Duration not specified',
    location: trip.location || 'Location not specified',
    mapCenter: trip.mapCenter || { lng: -98.5795, lat: 39.8283 }, // Default to US center
    itinerary: validateItinerary(trip.itinerary || []),
  };
  
  // Optional fields
  if (trip.suggestedGuides && Array.isArray(trip.suggestedGuides)) {
    validatedTrip.suggestedGuides = trip.suggestedGuides;
  }
  
  if (trip.markers && Array.isArray(trip.markers)) {
    validatedTrip.markers = trip.markers.map((marker: any) => ({
      name: marker.name || 'Point of Interest',
      coordinates: marker.coordinates || { lng: validatedTrip.mapCenter.lng, lat: validatedTrip.mapCenter.lat },
      description: marker.description,
      elevation: marker.elevation,
      details: marker.details
    }));
  }
  
  if (trip.journey) {
    validatedTrip.journey = {
      segments: validateJourneySegments(trip.journey.segments || []),
      totalDistance: trip.journey.totalDistance || 0,
      totalDuration: trip.journey.totalDuration || 0,
      bounds: trip.journey.bounds || [
        [validatedTrip.mapCenter.lng - 0.1, validatedTrip.mapCenter.lat - 0.1],
        [validatedTrip.mapCenter.lng + 0.1, validatedTrip.mapCenter.lat + 0.1]
      ]
    };
  }
  
  return validatedTrip;
};
