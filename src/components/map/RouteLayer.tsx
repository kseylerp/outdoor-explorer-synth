
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !journey || !journey.segments || journey.segments.length === 0) {
      return;
    }

    // Add popup styles
    addPopupStyles();
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add waypoint markers for better visibility of route points
    const addWaypointMarkers = (segment: Segment, index: number) => {
      if (!segment.geometry || !segment.geometry.coordinates || !map) return;
      
      // Add start and end markers for each segment
      const coordinates = segment.geometry.coordinates;
      if (coordinates.length < 2) return;
      
      // Only add start marker if this is the first segment or if not connected to previous segment
      const isFirstSegment = index === 0;
      
      if (isFirstSegment) {
        const startPoint = coordinates[0];
        const startMarkerEl = document.createElement('div');
        startMarkerEl.className = 'waypoint-marker start-marker';
        startMarkerEl.innerHTML = `
          <div style="
            width: 15px;
            height: 15px;
            background-color: #4CAF50;
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          "></div>
        `;
        
        const marker = new mapboxgl.Marker(startMarkerEl)
          .setLngLat(startPoint as [number, number])
          .addTo(map);
          
        markersRef.current.push(marker);
      }
      
      // Add end marker
      const endPoint = coordinates[coordinates.length - 1];
      const endMarkerEl = document.createElement('div');
      endMarkerEl.className = 'waypoint-marker end-marker';
      endMarkerEl.innerHTML = `
        <div style="
          width: ${index === journey.segments.length - 1 ? '18px' : '15px'};
          height: ${index === journey.segments.length - 1 ? '18px' : '15px'};
          background-color: ${index === journey.segments.length - 1 ? '#FF5722' : '#2196F3'};
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        "></div>
      `;
      
      const marker = new mapboxgl.Marker(endMarkerEl)
        .setLngLat(endPoint as [number, number])
        .addTo(map);
        
      markersRef.current.push(marker);
    };

    // First clean up any existing layers and sources to prevent conflicts
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

    // Add sources and layers for each segment
    journey.segments.forEach((segment, index) => {
      if (!segment.geometry || !segment.geometry.coordinates) {
        return;
      }
      
      // Densify route paths if there are only a few points
      if (segment.geometry.coordinates.length < 5) {
        console.log(`Segment ${index} has only ${segment.geometry.coordinates.length} coordinates - densifying path`);
        segment.geometry.coordinates = densifyPath(segment.geometry.coordinates);
      }

      const { sourceId, layerId } = addRouteSegment(map, segment, index);
      
      if (sourceId && layerId) {
        sourceIdsRef.current.push(sourceId);
        layerIdsRef.current.push(layerId);
        
        // Add interactivity
        addSegmentInteractions(map, segment, layerId);
        
        // Add waypoint markers
        addWaypointMarkers(segment, index);
      }
    });

    // Cleanup function
    return () => {
      if (!map || !map.getStyle()) return;
      
      // Remove waypoint markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Remove layers and sources in a safe way
      try {
        // Check if map and its style are still valid
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
      
      // Remove the popup styles
      removePopupStyles();
      
      // Reset refs
      layerIdsRef.current = [];
      sourceIdsRef.current = [];
    };
  }, [map, journey]);

  // Helper function to add more points along a straight line path
  const densifyPath = (coordinates: number[][]) => {
    if (coordinates.length < 2) return coordinates;
    
    const result: number[][] = [];
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      
      // Add start point
      result.push(start);
      
      // Add 8 intermediate points
      for (let j = 1; j <= 8; j++) {
        const ratio = j / 10;
        const lng = start[0] + (end[0] - start[0]) * ratio;
        const lat = start[1] + (end[1] - start[1]) * ratio;
        result.push([lng, lat]);
      }
    }
    
    // Add end point
    result.push(coordinates[coordinates.length - 1]);
    
    return result;
  };

  if (!map || !journey) return null;

  return (
    <JourneyBounds 
      map={map} 
      bounds={journey.bounds} 
    />
  );
};

export default RouteLayer;
