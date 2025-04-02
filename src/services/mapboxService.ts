
import { Journey, Segment } from '@/types/trips';

/**
 * Calls the Mapbox Directions API to get routing information
 * 
 * @param coordinates Array of [longitude, latitude] waypoints
 * @param mode Transportation mode
 * @param mapboxToken Optional token (will use localStorage if not provided)
 * @param options Additional options for the API
 * @returns Directions API response
 */
export const getDirections = async (
  coordinates: [number, number][],
  mode: 'driving' | 'walking' | 'cycling' | 'transit' = 'driving',
  mapboxToken?: string,
  options: {
    alternatives?: boolean;
    steps?: boolean;
    overview?: 'full' | 'simplified' | 'false';
    geometries?: 'geojson' | 'polyline';
    annotations?: string[];
  } = {}
): Promise<any> => {
  try {
    // Get token either from the parameter or from localStorage
    const token = mapboxToken || localStorage.getItem('mapbox_token');
    
    if (!token) {
      console.error('No Mapbox token available for directions API');
      return mockDirectionsResponse(coordinates, mode);
    }
    
    if (coordinates.length < 2) {
      console.error('At least 2 coordinates are required for directions');
      return mockDirectionsResponse(coordinates, mode);
    }
    
    // Format coordinates for the API request
    const coordinatesString = coordinates
      .map(coord => `${coord[0]},${coord[1]}`)
      .join(';');
    
    console.log(`Fetching directions with ${coordinates.length} waypoints via ${mode}`);
    
    // Default options
    const defaultOptions = {
      steps: true,
      geometries: 'geojson',
      overview: 'full',
    };
    
    // Merge default with provided options
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    Object.entries(mergedOptions).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    queryParams.append('access_token', token);
    
    // Make the actual API call to Mapbox Directions API
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${mode}/` +
      `${coordinatesString}?${queryParams.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting directions:', error);
    // Fall back to mock data if API call fails
    return mockDirectionsResponse(coordinates, mode);
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

/**
 * Process a journey to enhance routes with Mapbox Directions API
 * 
 * @param journey The journey to process
 * @returns Enhanced journey with detailed routing
 */
export const processJourneyWithDirections = async (
  journey: Journey
): Promise<Journey> => {
  if (!journey || !journey.segments || journey.segments.length === 0) {
    return journey;
  }
  
  try {
    // Process each segment in parallel
    const enhancedSegments = await Promise.all(
      journey.segments.map(async (segment) => {
        try {
          // Skip if already has detailed coordinates (more than 5 points)
          if (segment.geometry?.coordinates?.length > 5) {
            return segment;
          }
          
          const coords = segment.geometry?.coordinates;
          if (!coords || coords.length < 2) {
            return segment;
          }
          
          // For multiple waypoints, we need to call the directions API
          const waypointCoordinates = coords as [number, number][];
          const mode = segment.mode || 'driving';
          
          // Use the directionsAPI to get a realistic route
          const directions = await getDirections(
            waypointCoordinates,
            mode as any,
            undefined,
            { steps: true, overview: 'full' }
          );
          
          if (directions?.routes?.[0]?.geometry?.coordinates) {
            // Extract step instructions if available
            let steps = segment.steps || [];
            if (directions.routes[0].legs) {
              steps = directions.routes[0].legs.flatMap((leg: any) => 
                leg.steps.map((step: any) => ({
                  maneuver: {
                    instruction: step.maneuver.instruction || '',
                    location: step.maneuver.location || [0, 0]
                  },
                  distance: step.distance || 0,
                  duration: step.duration || 0
                }))
              );
            }
            
            return {
              ...segment,
              geometry: {
                ...segment.geometry,
                coordinates: directions.routes[0].geometry.coordinates
              },
              // Update distance and duration if available
              distance: directions.routes[0].distance || segment.distance,
              duration: directions.routes[0].duration || segment.duration,
              steps: steps
            };
          }
          
          return segment;
        } catch (error) {
          console.error('Error processing segment:', error);
          return segment;
        }
      })
    );
    
    // Update journey with enhanced segments
    return {
      ...journey,
      segments: enhancedSegments,
      // Recalculate totals
      totalDistance: enhancedSegments.reduce((acc, segment) => acc + segment.distance, 0),
      totalDuration: enhancedSegments.reduce((acc, segment) => acc + segment.duration, 0)
    };
  } catch (error) {
    console.error('Error processing journey:', error);
    return journey;
  }
};

// Mock data helper function for fallbacks
const mockDirectionsResponse = (
  coordinates: [number, number][], 
  mode: string
) => {
  if (coordinates.length < 2) {
    return {
      routes: []
    };
  }
  
  const origin = coordinates[0];
  const destination = coordinates[coordinates.length - 1];
  
  // Create a route with multiple points to simulate a realistic path
  const distance = calculateDistance(origin, destination);
  const numPoints = Math.max(10, Math.floor(distance * 5)); // More points for longer distances
  
  // Generate intermediate waypoints if only start/end provided
  let mockCoordinates: number[][];
  if (coordinates.length === 2) {
    mockCoordinates = generateRoutePoints(origin, destination, numPoints);
  } else {
    // Connect all provided waypoints
    mockCoordinates = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      const segmentPoints = generateRoutePoints(start, end, Math.max(5, Math.floor(calculateDistance(start, end) * 5)));
      
      // Add all points except last (to avoid duplication)
      if (i < coordinates.length - 2) {
        mockCoordinates.push(...segmentPoints.slice(0, -1));
      } else {
        // For the last segment, include the final point
        mockCoordinates.push(...segmentPoints);
      }
    }
  }
  
  // Mock distance and duration based on mode
  const speeds = {
    driving: 50, // km/h
    walking: 5,  // km/h
    cycling: 15, // km/h
    transit: 30  // km/h
  };
  
  const speed = speeds[mode as keyof typeof speeds] || 10;
  const duration = (distance / speed) * 3600; // Convert hours to seconds
  
  // Create mock legs for each segment
  const legs = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    const segmentDistance = calculateDistance(start, end) * 1000; // meters
    const segmentDuration = (segmentDistance / 1000 / speed) * 3600; // seconds
    
    legs.push({
      steps: [
        {
          maneuver: {
            instruction: `Travel by ${mode} to waypoint ${i + 1}`,
            location: start
          },
          distance: segmentDistance,
          duration: segmentDuration
        }
      ],
      distance: segmentDistance,
      duration: segmentDuration
    });
  }
  
  return {
    routes: [
      {
        geometry: {
          coordinates: mockCoordinates,
          type: "LineString"
        },
        legs: legs,
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
