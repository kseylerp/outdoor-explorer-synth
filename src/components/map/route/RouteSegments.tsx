
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { addRouteSegment } from '../utils/route-layer-utils';
import { addSegmentInteractions } from '../utils/route-interactions';

interface RouteSegmentsProps {
  map: mapboxgl.Map;
  segments: Segment[];
}

const RouteSegments: React.FC<RouteSegmentsProps> = ({ map, segments }) => {
  const layerIdsRef = useRef<string[]>([]);
  const sourceIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!map || !segments || segments.length === 0) {
      return;
    }

    // Clean up existing layers and sources
    const cleanupLayers = () => {
      try {
        if (map && map.getStyle()) {
          // Remove layers first
          layerIdsRef.current.forEach(id => {
            if (map.getLayer(id)) {
              map.removeLayer(id);
            }
            if (map.getLayer(`${id}-glow`)) {
              map.removeLayer(`${id}-glow`);
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
      
      // Reset refs
      layerIdsRef.current = [];
      sourceIdsRef.current = [];
    };
    
    // Clean up before adding new elements
    cleanupLayers();

    // Add sources and layers for each segment
    segments.forEach((segment, index) => {
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
      cleanupLayers();
    };
  }, [map, segments]);

  return null;
};

export default RouteSegments;
