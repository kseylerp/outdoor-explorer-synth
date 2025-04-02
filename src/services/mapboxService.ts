
import { Journey, Segment } from '@/types/trips';

// Mapbox directions API for actual route creation
export const getDirections = async (
  origin: [number, number], 
  destination: [number, number],
  mode: 'driving' | 'walking' | 'cycling' | 'transit' = 'driving',
  mapboxToken?: string
): Promise<any> => {
  try {
    // Get token either from the parameter or from localStorage
    const token = mapboxToken || localStorage.getItem('mapbox_token');
    
    if (!token) {
      console.error('No Mapbox token available for directions API');
      return mockDirectionsResponse(origin, destination, mode);
    }
    
    console.log(`Fetching directions from ${origin} to ${destination} via ${mode}`);
    
    // Make the actual API call to Mapbox Directions API
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${mode}/` +
      `${origin[0]},${origin[1]};${destination[0]},${destination[1]}` +
      `?steps=true&geometries=geojson&overview=full&access_token=${token}`
    );
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting directions:', error);
    // Fall back to mock data if API call fails
    return mockDirectionsResponse(origin, destination, mode);
  }
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
  const allCoords = segments.flatMap(segment => 
    segment.geometry && segment.geometry.coordinates ? segment.geometry.coordinates : []
  );
  
  if (allCoords.length === 0) {
    return {
      segments,
      totalDistance,
      totalDuration,
      bounds: [[-180, -90], [180, 90]] // Default world bounds
    };
  }
  
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

// Mock data helper function for fallbacks
const mockDirectionsResponse = (
  origin: [number, number], 
  destination: [number, number],
  mode: string
) => {
  // Create a route with multiple points to simulate a realistic path
  const distance = calculateDistance(origin, destination);
  const numPoints = Math.max(10, Math.floor(distance * 5)); // More points for longer distances
  const mockCoordinates = generateRoutePoints(origin, destination, numPoints);
  
  // Mock distance and duration based on mode
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
            ],
            distance: distance * 1000, // Convert to meters
            duration: duration
          }
        ],
        distance: distance * 1000, // Convert to meters
        duration: duration
      }
    ]
  };
};

// Generate a more realistic route with slight randomness
const generateRoutePoints = (start: number[], end: number[], numPoints: number): number[][] => {
  const points: number[][] = [start];
  
  // Create a slightly curved path with random variations
  for (let i = 1; i < numPoints - 1; i++) {
    const ratio = i / (numPoints - 1);
    
    // Calculate point along the direct path
    const lng = start[0] + (end[0] - start[0]) * ratio;
    const lat = start[1] + (end[1] - start[1]) * ratio;
    
    // Add some randomness for a more realistic path
    // More randomness in the middle, less at endpoints
    const randomFactor = Math.sin(ratio * Math.PI) * 0.005;
    const jitter = (Math.random() - 0.5) * randomFactor;
    
    // Perpendicular offset for curve effect
    const perpRatio = Math.sin(ratio * Math.PI);
    const perpOffset = perpRatio * 0.005;
    
    // Add point with jitter
    points.push([
      lng + jitter + perpOffset,
      lat + jitter - perpOffset
    ]);
  }
  
  points.push(end);
  return points;
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
