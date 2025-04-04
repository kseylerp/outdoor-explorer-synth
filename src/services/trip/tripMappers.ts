
import { Trip, Coordinates, Journey, ItineraryDay, Activity, Segment, Step } from '@/types/trips';
import { Json } from '@/integrations/supabase/types';

/**
 * Utility functions for mapping between Trip types and Supabase JSON types
 */

// Safely convert Supabase JSON to our Coordinates type
export const jsonToCoordinates = (json: Json | null): Coordinates => {
  if (!json) return { lng: 0, lat: 0 };
  
  const jsonObj = json as Record<string, number>;
  return {
    lng: typeof jsonObj.lng === 'number' ? jsonObj.lng : 0,
    lat: typeof jsonObj.lat === 'number' ? jsonObj.lat : 0
  };
};

// Safely convert Supabase JSON to our Markers array
export const jsonToMarkers = (json: Json | null): Trip['markers'] => {
  if (!json || !Array.isArray(json)) return [];
  
  return json.map(item => {
    const marker = item as Record<string, any>;
    return {
      name: marker.name || 'Unknown Point',
      coordinates: jsonToCoordinates(marker.coordinates as Json),
      description: marker.description,
      elevation: marker.elevation,
      details: marker.details
    };
  });
};

// Safely convert Supabase JSON to our Journey type
export const jsonToJourney = (json: Json | null): Journey | undefined => {
  if (!json) return undefined;
  
  const journeyData = json as Record<string, any>;
  
  if (!journeyData.segments || !Array.isArray(journeyData.segments)) {
    return undefined;
  }
  
  // Convert journey segments with proper typing
  const segments: Segment[] = journeyData.segments.map((segment: any) => ({
    mode: segment.mode || '',
    from: segment.from || '',
    to: segment.to || '',
    distance: segment.distance || 0,
    duration: segment.duration || 0,
    geometry: {
      coordinates: Array.isArray(segment.geometry?.coordinates) ? 
        segment.geometry.coordinates : []
    },
    steps: Array.isArray(segment.steps) ? segment.steps.map((step: any) => ({
      maneuver: {
        instruction: step.maneuver?.instruction || '',
        location: Array.isArray(step.maneuver?.location) ? 
          step.maneuver.location : [0, 0]
      },
      distance: step.distance || 0,
      duration: step.duration || 0
    })) : [],
    elevationGain: segment.elevationGain,
    terrain: segment.terrain,
    description: segment.description
  }));

  return {
    segments,
    totalDistance: journeyData.totalDistance || 0,
    totalDuration: journeyData.totalDuration || 0,
    bounds: journeyData.bounds || []
  };
};

// Safely convert Supabase JSON to our Itinerary array
export const jsonToItinerary = (json: Json | null): ItineraryDay[] => {
  if (!json) {
    console.warn('Itinerary data is null or undefined');
    return [];
  }
  
  // Check if json is an array
  if (!Array.isArray(json)) {
    console.warn('Itinerary is not an array:', json);
    // Try to parse it if it's a string
    if (typeof json === 'string') {
      try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          json = parsed;
        } else {
          console.error('Parsed itinerary is not an array');
          return [];
        }
      } catch (e) {
        console.error('Failed to parse itinerary string:', e);
        return [];
      }
    } else {
      // If it's an object with a days property, try to use that
      const jsonObj = json as Record<string, any>;
      if (jsonObj.days && Array.isArray(jsonObj.days)) {
        json = jsonObj.days;
      } else {
        console.error('Itinerary is not in a recognized format:', json);
        return [];
      }
    }
  }

  console.log('Processing itinerary array with', json.length, 'items');
  
  return json.map((day: any, index: number) => {
    if (!day) {
      console.warn(`Day ${index} in itinerary is undefined or null`);
      return {
        day: index + 1,
        title: 'Day ' + (index + 1),
        description: '',
        activities: []
      };
    }
    
    // If day number is missing, use the index
    const dayNumber = day.day !== undefined ? day.day : index + 1;
    
    return {
      day: dayNumber,
      title: day.title || 'Day ' + dayNumber,
      description: day.description || '',
      activities: Array.isArray(day.activities) ? day.activities.map((activity: any) => ({
        name: activity.name || '',
        type: activity.type || '',
        duration: activity.duration || '',
        description: activity.description || '',
        permitRequired: Boolean(activity.permitRequired),
        permitDetails: activity.permitDetails,
        outfitters: Array.isArray(activity.outfitters) ? activity.outfitters : [],
        location: activity.location,
        price: activity.price,
        equipmentNeeded: Array.isArray(activity.equipmentNeeded) ? activity.equipmentNeeded : [],
        weather: activity.weather,
        difficulty: activity.difficulty,
        distance: activity.distance,
        elevation: activity.elevation,
        routeType: activity.routeType,
        waypoints: Array.isArray(activity.waypoints) ? activity.waypoints : []
      })) : [],
      meals: day.meals,
      accommodations: day.accommodations,
      travelDuration: day.travelDuration,
      travelMode: day.travelMode
    };
  });
};
