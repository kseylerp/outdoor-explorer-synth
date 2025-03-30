
import { Trip } from '@/types/trips';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch recommendations from the Claude API
export const generateTrips = async (prompt: string): Promise<Trip[]> => {
  try {
    console.log("Calling trip-recommendations edge function with prompt:", prompt);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('trip-recommendations', {
      body: { prompt }
    });
    
    if (error) {
      console.error('Error calling trip-recommendations function:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Empty response from trip-recommendations');
      throw new Error('Empty response from API');
    }
    
    // If data is already in the expected format with a trips array
    if (data.trips && Array.isArray(data.trips)) {
      console.log('Received trip data in correct format:', data.trips.length, 'trips');
      
      // Validate each trip has required fields
      const validatedTrips = data.trips.map((trip: any) => validateAndTransformTrip(trip));
      return validatedTrips;
    }
    
    // If data is an array but not wrapped in a trips object
    if (Array.isArray(data)) {
      console.log('Received trip data as array, transforming to correct format');
      
      // Validate each trip has required fields
      const validatedTrips = data.map((trip: any) => validateAndTransformTrip(trip));
      return validatedTrips;
    }
    
    console.error('Invalid response format from trip-recommendations:', data);
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};

// Function to validate and transform trip data
const validateAndTransformTrip = (trip: any): Trip => {
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

// Helper to validate itinerary
const validateItinerary = (itinerary: any[]) => {
  if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    // Create default itinerary with one day
    return [{
      day: 1,
      title: 'Adventure Day',
      description: 'Enjoy your adventure',
      activities: [{
        name: 'Exploration',
        type: 'Sightseeing',
        duration: 'All day',
        description: 'Explore the area',
        permitRequired: false
      }]
    }];
  }
  
  return itinerary.map((day, index) => ({
    day: day.day || index + 1,
    title: day.title || `Day ${index + 1}`,
    description: day.description || 'No description available',
    activities: validateActivities(day.activities || [])
  }));
};

// Helper to validate activities
const validateActivities = (activities: any[]) => {
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return [{
      name: 'Exploration',
      type: 'Sightseeing',
      duration: 'All day',
      description: 'Explore the area',
      permitRequired: false
    }];
  }
  
  return activities.map(activity => ({
    name: activity.name || 'Activity',
    type: activity.type || 'Sightseeing',
    duration: activity.duration || 'Varies',
    description: activity.description || 'No description available',
    permitRequired: activity.permitRequired || false,
    permitDetails: activity.permitDetails,
    outfitters: activity.outfitters
  }));
};

// Helper to validate journey segments
const validateJourneySegments = (segments: any[]) => {
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    return [{
      mode: 'walking',
      from: 'Starting Point',
      to: 'Destination',
      distance: 1000,
      duration: 1200,
      geometry: {
        coordinates: [[-98.5795, 39.8283], [-98.5895, 39.8383]]
      },
      steps: [{
        maneuver: {
          instruction: 'Follow the path',
          location: [-98.5795, 39.8283]
        },
        distance: 1000,
        duration: 1200
      }]
    }];
  }
  
  return segments.map(segment => ({
    mode: segment.mode || 'walking',
    from: segment.from || 'Starting Point',
    to: segment.to || 'Destination',
    distance: segment.distance || 0,
    duration: segment.duration || 0,
    geometry: {
      coordinates: segment.geometry?.coordinates || [[-98.5795, 39.8283], [-98.5895, 39.8383]]
    },
    steps: validateSteps(segment.steps || []),
    elevationGain: segment.elevationGain,
    terrain: segment.terrain,
    description: segment.description
  }));
};

// Helper to validate steps
const validateSteps = (steps: any[]) => {
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return [{
      maneuver: {
        instruction: 'Follow the path',
        location: [-98.5795, 39.8283]
      },
      distance: 1000,
      duration: 1200
    }];
  }
  
  return steps.map(step => ({
    maneuver: {
      instruction: step.maneuver?.instruction || 'Continue',
      location: step.maneuver?.location || [-98.5795, 39.8283]
    },
    distance: step.distance || 0,
    duration: step.duration || 0
  }));
};

// Helper to generate a unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Function to fetch guides from Supabase
export const fetchGuides = async () => {
  try {
    const { data, error } = await supabase
      .from('guide_services')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
};

// Function to fetch activities from Supabase
export const fetchActivities = async () => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
