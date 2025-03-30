
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
  
  return {
    segments: journeyData.segments.map((segment: any) => ({
      mode: segment.mode || '',
      from: segment.from || '',
      to: segment.to || '',
      distance: segment.distance || 0,
      duration: segment.duration || 0,
      geometry: {
        coordinates: segment.geometry?.coordinates || [[0, 0], [0, 0]]
      },
      steps: Array.isArray(segment.steps) ? segment.steps.map((step: any) => ({
        maneuver: {
          instruction: step.maneuver?.instruction || '',
          location: step.maneuver?.location || [0, 0]
        },
        distance: step.distance || 0,
        duration: step.duration || 0
      })) : []
    })),
    totalDistance: journeyData.totalDistance || 0,
    totalDuration: journeyData.totalDuration || 0,
    bounds: journeyData.bounds || [[0, 0], [0, 0]]
  };
};

// Safely convert Supabase JSON to our Itinerary array
export const jsonToItinerary = (json: Json | null): ItineraryDay[] => {
  if (!json || !Array.isArray(json)) return [];
  
  return json.map((day: any, index: number) => ({
    day: day.day || index + 1,
    title: day.title || 'Day ' + (index + 1),
    description: day.description || '',
    activities: Array.isArray(day.activities) ? day.activities.map((activity: any) => ({
      name: activity.name || '',
      type: activity.type || '',
      duration: activity.duration || '',
      description: activity.description || '',
      permitRequired: Boolean(activity.permitRequired),
      permitDetails: activity.permitDetails,
      outfitters: Array.isArray(activity.outfitters) ? activity.outfitters : []
    })) : []
  }));
};
