
import { ItineraryDay, Activity, Segment, Step } from '@/types/trips';

// Helper to generate a unique ID
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper to validate itinerary without adding defaults
export const validateItinerary = (itinerary: any[]): ItineraryDay[] => {
  if (!itinerary || !Array.isArray(itinerary)) {
    console.warn('Itinerary is missing or not an array');
    return [];
  }
  
  return itinerary.map((day, index) => {
    if (!day) {
      console.warn(`Day ${index} in itinerary is undefined or null`);
      return {
        day: index + 1,
        title: `Day ${index + 1}`,
        description: 'No description available',
        activities: []
      };
    }
    
    return {
      day: day.day || index + 1,
      title: day.title || `Day ${index + 1}`,
      description: day.description || 'No description available',
      activities: day.activities ? validateActivities(day.activities) : []
    };
  });
};

// Helper to validate activities without adding defaults
export const validateActivities = (activities: any[]): Activity[] => {
  if (!activities || !Array.isArray(activities)) {
    return [];
  }
  
  return activities.map(activity => {
    if (!activity) {
      console.warn('An activity in the itinerary is undefined or null');
      return {
        name: 'Unknown activity',
        type: 'Other',
        duration: 'Unknown',
        description: 'No description available',
        permitRequired: false
      };
    }
    
    return {
      name: activity.name || 'Unknown activity',
      type: activity.type || 'Other',
      duration: activity.duration || 'Unknown',
      description: activity.description || 'No description available',
      permitRequired: typeof activity.permitRequired === 'boolean' ? activity.permitRequired : false,
      permitDetails: activity.permitDetails,
      outfitters: activity.outfitters
    };
  });
};

// Helper to validate journey segments
export const validateJourneySegments = (segments: any[]): Segment[] => {
  if (!segments || !Array.isArray(segments)) {
    return [];
  }
  
  return segments.map(segment => {
    if (!segment) {
      console.warn('A segment in the journey is undefined or null');
      return {
        mode: 'unknown',
        from: 'Unknown start',
        to: 'Unknown destination',
        distance: 0,
        duration: 0,
        geometry: {
          coordinates: [[0, 0], [0, 0]]
        },
        steps: []
      };
    }
    
    return {
      mode: segment.mode || 'unknown',
      from: segment.from || 'Unknown start',
      to: segment.to || 'Unknown destination',
      distance: segment.distance || 0,
      duration: segment.duration || 0,
      geometry: {
        coordinates: segment.geometry?.coordinates || [[0, 0], [0, 0]]
      },
      steps: segment.steps ? validateSteps(segment.steps) : [],
      elevationGain: segment.elevationGain,
      terrain: segment.terrain,
      description: segment.description
    };
  });
};

// Helper to validate steps
export const validateSteps = (steps: any[]): Step[] => {
  if (!steps || !Array.isArray(steps)) {
    return [];
  }
  
  return steps.map(step => {
    if (!step) {
      console.warn('A step in a journey segment is undefined or null');
      return {
        maneuver: {
          instruction: 'No instruction available',
          location: [0, 0]
        },
        distance: 0,
        duration: 0
      };
    }
    
    return {
      maneuver: {
        instruction: step.maneuver?.instruction || 'No instruction available',
        location: step.maneuver?.location || [0, 0]
      },
      distance: step.distance || 0,
      duration: step.duration || 0
    };
  });
};
