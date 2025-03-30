
import { Trip, ItineraryDay, Activity, Journey, Segment, Step } from '@/types/trips';

// Helper to generate a unique ID
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper to validate itinerary
export const validateItinerary = (itinerary: any[]): ItineraryDay[] => {
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
export const validateActivities = (activities: any[]): Activity[] => {
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
export const validateJourneySegments = (segments: any[]): Segment[] => {
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
export const validateSteps = (steps: any[]): Step[] => {
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
