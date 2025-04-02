
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { addRouteSegment } from './utils/route-layer-utils';
import { addSegmentInteractions } from './utils/route-interactions';
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
  isLoading?: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ map, journey, isLoading = false }) => {
  const layerIdsRef = useRef<string[]>([]);
  const sourceIdsRef = useRef<string[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !journey || !journey.segments || journey.segments.length === 0) {
      return;
    }

    // Add popup styles
    addPopupStyles();
    
    // Clean up existing layers, sources, and markers
    const cleanupMap = () => {
      // Remove markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Remove layers and sources in a safe way
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
    cleanupMap();
    
    // Don't add new layers if still loading
    if (isLoading) {
      return;
    }

    // Helper function to add waypoint markers
    const addWaypointMarkers = () => {
      // Only create markers for the journey's key points
      if (!journey || !journey.segments || !map) return;
      
      // Special handling for first segment's start point
      if (journey.segments.length > 0) {
        const firstSegment = journey.segments[0];
        if (firstSegment.geometry?.coordinates?.length > 0) {
          const startPoint = firstSegment.geometry.coordinates[0];
          const startMarkerEl = document.createElement('div');
          startMarkerEl.className = 'waypoint-marker start-marker';
          startMarkerEl.innerHTML = `
            <div style="
              width: 18px;
              height: 18px;
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
      }
      
      // Add end marker for the last segment
      if (journey.segments.length > 0) {
        const lastSegment = journey.segments[journey.segments.length - 1];
        if (lastSegment.geometry?.coordinates?.length > 0) {
          const coords = lastSegment.geometry.coordinates;
          const endPoint = coords[coords.length - 1];
          const endMarkerEl = document.createElement('div');
          endMarkerEl.className = 'waypoint-marker end-marker';
          endMarkerEl.innerHTML = `
            <div style="
              width: 18px;
              height: 18px;
              background-color: #FF5722;
              border: 2px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            "></div>
          `;
          
          const marker = new mapboxgl.Marker(endMarkerEl)
            .setLngLat(endPoint as [number, number])
            .addTo(map);
            
          markersRef.current.push(marker);
        }
      }
      
      // Add intermediate waypoint markers for segment transitions
      journey.segments.forEach((segment, index) => {
        // Skip the last segment as we've already added its end point
        if (index === journey.segments.length - 1) return;
        
        // Get the end point of the current segment
        if (segment.geometry?.coordinates?.length > 0) {
          const coords = segment.geometry.coordinates;
          const waypointCoords = coords[coords.length - 1];
          
          const waypointEl = document.createElement('div');
          waypointEl.className = 'waypoint-marker intermediate-marker';
          waypointEl.innerHTML = `
            <div style="
              width: 14px;
              height: 14px;
              background-color: #2196F3;
              border: 2px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            "></div>
          `;
          
          const marker = new mapboxgl.Marker(waypointEl)
            .setLngLat(waypointCoords as [number, number])
            .addTo(map);
            
          markersRef.current.push(marker);
        }
      });
    };

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
    
    // Add waypoint markers after all routes are drawn
    addWaypointMarkers();

    // Cleanup function
    return () => {
      cleanupMap();
      removePopupStyles();
    };
  }, [map, journey, isLoading]);

  if (!map || !journey) return null;

  return (
    <JourneyBounds 
      map={map} 
      bounds={journey.bounds} 
    />
  );
};

export default RouteLayer;
