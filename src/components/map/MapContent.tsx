
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MarkerLayer from './MarkerLayer';
import RouteLayer from './RouteLayer';
import { Journey, Segment } from '@/types/trips';
import { MapMarker } from './types';
import { toast } from '@/hooks/use-toast';
import { getDirections } from '@/services/mapboxService';

interface MapContentProps {
  map: mapboxgl.Map;
  markers?: MapMarker[];
  journey?: Journey;
  routeType?: string;
}

const MapContent: React.FC<MapContentProps> = ({ map, markers = [], journey, routeType = 'all' }) => {
  const [processedJourney, setProcessedJourney] = useState<Journey | undefined>(journey);
  
  // Validate markers are properly formed before rendering
  const validMarkers = Array.isArray(markers) ? markers.filter(marker => 
    marker && marker.coordinates && 
    typeof marker.coordinates.lng === 'number' && 
    typeof marker.coordinates.lat === 'number'
  ) : [];
  
  // Process routes with real Mapbox directions when journey exists
  useEffect(() => {
    if (!journey || !journey.segments || journey.segments.length === 0) {
      setProcessedJourney(undefined);
      return;
    }
    
    // Helper function to process a segment with real directions API
    const processSegment = async (segment: Segment): Promise<Segment> => {
      try {
        // Skip if already has detailed coordinates (more than 5 points)
        if (segment.geometry?.coordinates?.length > 5) {
          return segment;
        }
        
        // Get first and last point from segment
        const coords = segment.geometry?.coordinates;
        if (!coords || coords.length < 2) {
          return segment;
        }
        
        const origin = coords[0];
        const destination = coords[coords.length - 1];
        const mode = segment.mode || 'driving';
        
        // Use the directionsAPI to get a realistic route
        const directions = await getDirections(
          origin as [number, number], 
          destination as [number, number], 
          mode as any
        );
        
        if (directions?.routes?.[0]?.geometry?.coordinates) {
          return {
            ...segment,
            geometry: {
              ...segment.geometry,
              coordinates: directions.routes[0].geometry.coordinates
            },
            // Update distance and duration if available
            distance: directions.routes[0].distance || segment.distance,
            duration: directions.routes[0].duration || segment.duration
          };
        }
        
        return segment;
      } catch (error) {
        console.error('Error processing segment:', error);
        return segment;
      }
    };
    
    // Process all segments
    const processJourney = async () => {
      try {
        // Process each segment in parallel
        const processedSegments = await Promise.all(
          journey.segments.map(processSegment)
        );
        
        // Update journey with processed segments
        setProcessedJourney({
          ...journey,
          segments: processedSegments
        });
      } catch (error) {
        console.error('Error processing journey:', error);
        setProcessedJourney(journey);
      }
    };
    
    processJourney();
  }, [journey]);
  
  // Check if journey exists and has minimal required properties
  const hasValidJourney = processedJourney && 
    processedJourney.segments && 
    Array.isArray(processedJourney.segments) && 
    processedJourney.segments.length > 0;
    
  // Warn about sparse waypoints that could benefit from directions
  useEffect(() => {
    if (hasValidJourney) {
      const hasSparsePath = processedJourney.segments.some(segment => 
        segment.geometry.coordinates.length < 3
      );
      
      if (hasSparsePath) {
        console.log("Detected sparse waypoints in journey - for more realistic routes, consider using Mapbox Directions API");
      }
    }
  }, [processedJourney, hasValidJourney]);
  
  // Filter segments by route type if specified
  const filteredJourney = hasValidJourney && routeType !== 'all' 
    ? {
        ...processedJourney,
        segments: processedJourney.segments.filter(segment => {
          // Map the route type to segment mode
          switch(routeType) {
            case 'walk':
              return segment.mode === 'walking' || segment.mode === 'hiking';
            case 'bike':
              return segment.mode === 'cycling';
            case 'drive':
              return segment.mode === 'driving';
            case 'transit':
              return segment.mode === 'transit';
            default:
              return true;
          }
        })
      }
    : processedJourney;
  
  // Notify if filtered journey has no segments
  useEffect(() => {
    if (hasValidJourney && 
        routeType !== 'all' && 
        filteredJourney?.segments.length === 0) {
      toast({
        title: "No routes available",
        description: `No ${routeType} routes found for this trip.`,
        variant: "default"
      });
    }
  }, [filteredJourney, hasValidJourney, routeType]);
  
  return (
    <>
      {validMarkers.length > 0 && (
        <MarkerLayer map={map} markers={validMarkers} />
      )}
      
      {hasValidJourney && filteredJourney && filteredJourney.segments.length > 0 && (
        <RouteLayer map={map} journey={filteredJourney} />
      )}
    </>
  );
};

export default MapContent;
