
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';

interface WaypointMarkersProps {
  map: mapboxgl.Map;
  segments: Segment[];
}

const WaypointMarkers: React.FC<WaypointMarkersProps> = ({ map, segments }) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Clean up existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (!segments || segments.length === 0) return;

    // Helper function to create a marker element with specified color
    const createMarkerElement = (color: string, size: number): HTMLDivElement => {
      const el = document.createElement('div');
      el.className = 'waypoint-marker';
      el.innerHTML = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        "></div>
      `;
      return el;
    };

    // Add start marker
    if (segments.length > 0) {
      const firstSegment = segments[0];
      if (firstSegment.geometry?.coordinates?.length > 0) {
        const startPoint = firstSegment.geometry.coordinates[0];
        const startMarkerEl = createMarkerElement('#4CAF50', 18);
        startMarkerEl.className += ' start-marker';
        
        const marker = new mapboxgl.Marker(startMarkerEl)
          .setLngLat(startPoint as [number, number])
          .addTo(map);
          
        markersRef.current.push(marker);
      }
    }
    
    // Add end marker for the last segment
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      if (lastSegment.geometry?.coordinates?.length > 0) {
        const coords = lastSegment.geometry.coordinates;
        const endPoint = coords[coords.length - 1];
        const endMarkerEl = createMarkerElement('#FF5722', 18);
        endMarkerEl.className += ' end-marker';
        
        const marker = new mapboxgl.Marker(endMarkerEl)
          .setLngLat(endPoint as [number, number])
          .addTo(map);
          
        markersRef.current.push(marker);
      }
    }
    
    // Add intermediate waypoint markers for segment transitions
    segments.forEach((segment, index) => {
      // Skip the last segment as we've already added its end point
      if (index === segments.length - 1) return;
      
      // Get the end point of the current segment
      if (segment.geometry?.coordinates?.length > 0) {
        const coords = segment.geometry.coordinates;
        const waypointCoords = coords[coords.length - 1];
        
        const waypointEl = createMarkerElement('#2196F3', 14);
        waypointEl.className += ' intermediate-marker';
        
        const marker = new mapboxgl.Marker(waypointEl)
          .setLngLat(waypointCoords as [number, number])
          .addTo(map);
          
        markersRef.current.push(marker);
      }
    });

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, segments]);

  return null;
};

export default WaypointMarkers;
