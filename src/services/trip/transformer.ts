
import { Trip } from '@/types/trips';
import { 
  generateUniqueId, 
  validateItinerary, 
  validateJourneySegments 
} from './validation';

// Function to validate and transform trip data while preserving structure for missing data
export const validateAndTransformTrip = (trip: any): Trip => {
  if (!trip) {
    console.error('Trip data is null or undefined');
    throw new Error('Trip data is missing');
  }
  
  // Only generate ID if not present - Trip ID is always required
  if (!trip.id) {
    console.warn('Trip is missing ID, generating a new one');
    trip.id = generateUniqueId();
  }
  
  // Check for required fields and log detailed warnings
  const requiredFields = [
    'title', 'description', 'whyWeChoseThis', 'difficultyLevel',
    'priceEstimate', 'duration', 'location', 'mapCenter'
  ];
  
  // Log missing fields but don't throw
  const missingFields = requiredFields.filter(field => !trip[field]);
  if (missingFields.length > 0) {
    console.warn(`Trip (ID: ${trip.id}) is missing required fields: ${missingFields.join(', ')}`);
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
  
  // Extract price breakdown if available
  const priceBreakdown: Record<string, number | string> = {};
  if (trip.priceBreakdown) {
    Object.assign(priceBreakdown, trip.priceBreakdown);
  }
  
  // Look for top-level price fields that might be part of a breakdown
  const priceRelatedKeys = Object.keys(trip).filter(key => 
    key.toLowerCase().includes('price') || 
    key.toLowerCase().includes('cost') ||
    key.toLowerCase().includes('fee')
  );
  
  priceRelatedKeys.forEach(key => {
    if (key !== 'priceEstimate' && key !== 'priceBreakdown') {
      priceBreakdown[key] = trip[key];
    }
  });
  
  // Create validated trip object preserving structure for missing data
  const validatedTrip: Trip = {
    id: trip.id,
    title: trip.title || 'Unknown Trip',
    description: trip.description || '',
    whyWeChoseThis: trip.whyWeChoseThis || '',
    difficultyLevel: trip.difficultyLevel || 'Unknown',
    priceEstimate: priceEstimateValue || 0,
    duration: trip.duration || '',
    location: trip.location || '',
    mapCenter: trip.mapCenter || { lng: 0, lat: 0 },
    itinerary: trip.itinerary ? validateItinerary(trip.itinerary) : [],
  };
  
  // Add price breakdown if we found any
  if (Object.keys(priceBreakdown).length > 0) {
    validatedTrip.priceBreakdown = priceBreakdown;
  }
  
  // Process all extra fields to preserve data
  for (const [key, value] of Object.entries(trip)) {
    if (
      !['id', 'title', 'description', 'whyWeChoseThis', 'difficultyLevel', 
        'priceEstimate', 'duration', 'location', 'mapCenter', 'itinerary',
        'journey', 'markers', 'suggestedGuides'].includes(key) && 
      value !== undefined
    ) {
      // @ts-ignore - Add any extra fields to the trip object
      validatedTrip[key] = value;
    }
  }
  
  // Optional fields - only add if present in input
  if (trip.suggestedGuides && Array.isArray(trip.suggestedGuides)) {
    validatedTrip.suggestedGuides = trip.suggestedGuides;
  }
  
  if (trip.markers && Array.isArray(trip.markers)) {
    validatedTrip.markers = trip.markers.map((marker: any) => ({
      name: marker.name || 'Unknown Point',
      coordinates: marker.coordinates || validatedTrip.mapCenter,
      description: marker.description,
      elevation: marker.elevation,
      details: marker.details
    }));
  }
  
  if (trip.journey) {
    // Log validation warnings for journey data
    if (!trip.journey.segments) {
      console.warn(`Trip (ID: ${trip.id}) has journey but missing journey.segments`);
    }
    
    if (!trip.journey.bounds) {
      console.warn(`Trip (ID: ${trip.id}) has journey but missing journey.bounds`);
    }
    
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
  
  // Add additional fields for complete data preservation
  const additionalFields = [
    'seasonalInfo', 'bestTimeToVisit', 'permits', 'weatherInfo', 
    'equipmentRecommendations', 'localTips', 'accessibility',
    'environmentalImpact', 'alternativeOptions', 'highlights',
    'safetyNotes', 'languagesSpoken', 'currency', 'timeZone', 'visaRequirements'
  ];
  
  additionalFields.forEach(field => {
    if (trip[field] !== undefined) {
      // @ts-ignore - We've defined these fields in the Trip interface
      validatedTrip[field] = trip[field];
    }
  });
  
  return validatedTrip;
};
