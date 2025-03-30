
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
        title: '',
        description: '',
        activities: []
      };
    }
    
    // If day number is missing, use the index
    const dayNumber = day.day !== undefined ? day.day : index + 1;
    
    return {
      day: dayNumber,
      title: day.title || '',
      description: day.description || '',
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
        name: '',
        type: '',
        duration: '',
        description: '',
        permitRequired: false
      };
    }
    
    // Only include permitRequired if it's explicitly defined, otherwise default to false
    const activityData: Activity = {
      name: activity.name || '',
      type: activity.type || '',
      duration: activity.duration || '',
      description: activity.description || '',
      permitRequired: typeof activity.permitRequired === 'boolean' ? activity.permitRequired : false
    };
    
    // Only add optional fields if they exist
    if (activity.permitDetails) {
      activityData.permitDetails = activity.permitDetails;
    }
    
    if (activity.outfitters && Array.isArray(activity.outfitters)) {
      activityData.outfitters = activity.outfitters;
    }
    
    return activityData;
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
        mode: '',
        from: '',
        to: '',
        distance: 0,
        duration: 0,
        geometry: {
          coordinates: [[0, 0], [0, 0]]
        },
        steps: []
      };
    }
    
    const validatedSegment: Segment = {
      mode: segment.mode || '',
      from: segment.from || '',
      to: segment.to || '',
      distance: segment.distance || 0,
      duration: segment.duration || 0,
      geometry: {
        coordinates: segment.geometry?.coordinates || [[0, 0], [0, 0]]
      },
      steps: segment.steps ? validateSteps(segment.steps) : []
    };
    
    // Only add optional fields if they exist
    if (segment.elevationGain !== undefined) {
      validatedSegment.elevationGain = segment.elevationGain;
    }
    
    if (segment.terrain) {
      validatedSegment.terrain = segment.terrain;
    }
    
    if (segment.description) {
      validatedSegment.description = segment.description;
    }
    
    return validatedSegment;
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
          instruction: '',
          location: [0, 0]
        },
        distance: 0,
        duration: 0
      };
    }
    
    return {
      maneuver: {
        instruction: step.maneuver?.instruction || '',
        location: step.maneuver?.location || [0, 0]
      },
      distance: step.distance || 0,
      duration: step.duration || 0
    };
  });
};
