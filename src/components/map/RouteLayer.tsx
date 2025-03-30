
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { addRouteSegment, addSegmentInteractions } from './utils/route-segment-utils';
import { addPopupStyles, removePopupStyles } from './utils/popup-utils';
import JourneyBounds from './JourneyBounds';

interface RouteLayerProps {
  map: mapboxgl.Map | null;
  journey?: {
    segments: Segment[];
    totalDistance: number;
    totalDuration: number;
    bounds?: number[][];
  };
}

const RouteLayer: React.FC<RouteLayerProps> = ({ map, journey }) => {
  const layerIdsRef = useRef<string[]>([]);
  const sourceIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!map || !journey || !journey.segments || journey.segments.length === 0) {
      return;
    }

    // Add popup styles
    addPopupStyles();

    // Add sources and layers for each segment
    journey.segments.forEach((segment, index) => {
      if (!segment.geometry || !segment.geometry.coordinates) {
        return;
      }

      const { sourceId, layerId } = addRouteSegment(map, segment, index);
      
      if (sourceId && layerId) {
        sourceIdsRef.current.push(sourceId);
        layerIdsRef.current.push(layerId);
        
        // Add interactivity
        addSegmentInteractions(map, segment, layerId);
      }
    });

    // Cleanup function
    return () => {
      if (!map || !map.getStyle()) return;
      
      // Remove layers and sources in a safe way
      try {
        // Check if map and its style are still valid
        if (map && map.getStyle()) {
          // Remove layers first
          layerIdsRef.current.forEach(id => {
            if (map.getLayer(id)) {
              map.removeLayer(id);
            }
          });
          
          // Then remove sources
          sourceIdsRef.current.forEach(id => {
            if (map.getSource(id)) {
              map.removeSource(id);
            }
          });
        }
      } catch (error) {
        console.error('Error cleaning up map layers/sources:', error);
      }
      
      // Remove the popup styles
      removePopupStyles();
      
      // Reset refs
      layerIdsRef.current = [];
      sourceIdsRef.current = [];
    };
  }, [map, journey]);

  if (!map || !journey) return null;

  return (
    <JourneyBounds 
      map={map} 
      bounds={journey.bounds} 
    />
  );
};

export default RouteLayer;
