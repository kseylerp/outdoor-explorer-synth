
// This would be a real service in a production app
// For now, we're using mock data for demonstration

import { Journey, Segment } from '@/types/trips';

export const getDirections = async (
  origin: [number, number], 
  destination: [number, number],
  mode: 'driving' | 'walking' | 'cycling' | 'transit' = 'driving'
): Promise<any> => {
  // In a real app, this would call the Mapbox API
  // For demonstration, return mock data
  
  // Example API call:
  /*
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY21zbjd1eWRmMHF0azJybnNsN2RxdGYwOCJ9.h_LpGv5W13OT59tQiAopcA';
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${mode}/` +
    `${origin[0]},${origin[1]};${destination[0]},${destination[1]}` +
    `?steps=true&geometries=geojson&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`
  );
  
  return await response.json();
  */
  
  // Return mock data for now
  return mockDirectionsResponse(origin, destination, mode);
};

export const combineJourneySegments = (segments: Segment[]): Journey => {
  let totalDistance = 0;
  let totalDuration = 0;
  
  // Calculate totals
  segments.forEach(segment => {
    totalDistance += segment.distance;
    totalDuration += segment.duration;
  });
  
  // Calculate bounds
  const allCoords = segments.flatMap(segment => segment.geometry.coordinates);
  const lngs = allCoords.map(coord => coord[0]);
  const lats = allCoords.map(coord => coord[1]);
  
  const bounds = [
    [Math.min(...lngs), Math.min(...lats)], // Southwest
    [Math.max(...lngs), Math.max(...lats)]  // Northeast
  ];
  
  return {
    segments,
    totalDistance,
    totalDuration,
    bounds
  };
};

// Mock data helper function
const mockDirectionsResponse = (
  origin: [number, number], 
  destination: [number, number],
  mode: string
) => {
  // Create a simple straight line path between points
  const midPoint = [
    origin[0] + (destination[0] - origin[0]) / 2,
    origin[1] + (destination[1] - origin[1]) / 2
  ];
  
  // Add a slight curve to make it look more realistic
  const offset = 0.005;
  const curvePoint = [
    midPoint[0] + (mode === 'driving' ? offset : -offset),
    midPoint[1] + (mode === 'cycling' ? offset : -offset)
  ];
  
  const mockCoordinates = [
    origin,
    curvePoint,
    destination
  ];
  
  // Mock distance and duration based on mode
  const distance = calculateDistance(origin, destination);
  const speeds = {
    driving: 50, // km/h
    walking: 5,  // km/h
    cycling: 15, // km/h
    transit: 30  // km/h
  };
  
  const speed = speeds[mode as keyof typeof speeds] || 10;
  const duration = (distance / speed) * 3600; // Convert hours to seconds
  
  return {
    routes: [
      {
        geometry: {
          coordinates: mockCoordinates,
          type: "LineString"
        },
        legs: [
          {
            steps: [
              {
                maneuver: {
                  instruction: `Travel by ${mode} to destination`,
                  location: origin
                },
                distance: distance * 1000, // Convert to meters
                duration: duration
              }
            ]
          }
        ],
        distance: distance * 1000, // Convert to meters
        duration: duration
      }
    ]
  };
};

// Helper function to calculate distance between two coordinates (in kilometers)
const calculateDistance = (point1: number[], point2: number[]): number => {
  const [lon1, lat1] = point1;
  const [lon2, lat2] = point2;
  
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};
