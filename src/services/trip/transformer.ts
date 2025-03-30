
import { Trip } from '@/types/trips';
import { 
  generateUniqueId, 
  validateItinerary, 
  validateJourneySegments 
} from './validation';

// Function to validate and transform trip data without adding default values
export const validateAndTransformTrip = (trip: any): Trip => {
  // Only generate ID if not present
  if (!trip.id) {
    trip.id = generateUniqueId();
  }
  
  // Check for required fields
  const requiredFields = [
    'title', 'description', 'whyWeChoseThis', 'difficultyLevel',
    'priceEstimate', 'duration', 'location', 'mapCenter', 'itinerary'
  ];
  
  // Log missing fields but don't throw
  const missingFields = requiredFields.filter(field => !trip[field]);
  if (missingFields.length > 0) {
    console.warn(`Trip is missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Convert priceEstimate to number if it's a string
  let priceEstimateValue = trip.priceEstimate;
  if (typeof priceEstimateValue === 'string') {
    // Try to extract a numeric value from the string
    const match = priceEstimateValue.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
    if (match) {
      // Remove commas and convert to number
      priceEstimateValue = Number(match[1].replace(/,/g, ''));
    } else {
      // Default to 0 if we can't extract a number
      console.warn(`Could not parse priceEstimate from: ${priceEstimateValue}`);
      priceEstimateValue = 0;
    }
  }
  
  // Create validated trip object with minimal default values
  const validatedTrip: Trip = {
    id: trip.id,
    title: trip.title || 'No title available',
    description: trip.description || 'No description available',
    whyWeChoseThis: trip.whyWeChoseThis || 'No information available',
    difficultyLevel: trip.difficultyLevel || 'Unknown',
    priceEstimate: priceEstimateValue || 0,
    duration: trip.duration || 'Unknown duration',
    location: trip.location || 'Unknown location',
    mapCenter: trip.mapCenter || { lng: 0, lat: 0 },
    itinerary: trip.itinerary ? validateItinerary(trip.itinerary) : [],
  };
  
  // Optional fields - only add if present in input
  if (trip.suggestedGuides && Array.isArray(trip.suggestedGuides)) {
    validatedTrip.suggestedGuides = trip.suggestedGuides;
  }
  
  if (trip.markers && Array.isArray(trip.markers)) {
    validatedTrip.markers = trip.markers.map((marker: any) => ({
      name: marker.name || 'Unknown marker',
      coordinates: marker.coordinates || validatedTrip.mapCenter,
      description: marker.description,
      elevation: marker.elevation,
      details: marker.details
    }));
  }
  
  if (trip.journey) {
    validatedTrip.journey = {
      segments: trip.journey.segments ? validateJourneySegments(trip.journey.segments) : [],
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
