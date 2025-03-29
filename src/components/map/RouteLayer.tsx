
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';

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

    // Add sources and layers for each segment
    journey.segments.forEach((segment, index) => {
      if (!segment.geometry || !segment.geometry.coordinates) {
        return;
      }

      const sourceId = `route-source-${index}`;
      const layerId = `route-layer-${index}`;

      sourceIdsRef.current.push(sourceId);
      layerIdsRef.current.push(layerId);

      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: segment.geometry.coordinates
            }
          }
        });
      } else {
        // Update existing source
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: segment.geometry.coordinates
            }
          });
        }
      }

      // Add layer if it doesn't exist
      if (!map.getLayer(layerId)) {
        const color = segment.mode === 'walking' ? '#4AB651' : '#3A85C5';
        
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      }
    });

    // Fit the map to the journey bounds if available
    if (journey.bounds && journey.bounds.length === 2) {
      const bounds = new mapboxgl.LngLatBounds(
        journey.bounds[0] as [number, number],
        journey.bounds[1] as [number, number]
      );
      
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000
      });
    }

    // Add click listeners for interactive segments
    journey.segments.forEach((segment, index) => {
      const layerId = `route-layer-${index}`;
      
      // Add click handler to show segment details
      map.on('click', layerId, (e) => {
        const coordinates = e.lngLat;
        
        const segmentDetails = `
          <h3>${segment.from} to ${segment.to}</h3>
          <p><strong>Mode:</strong> ${segment.mode}</p>
          <p><strong>Distance:</strong> ${(segment.distance / 1000).toFixed(1)} km</p>
          <p><strong>Duration:</strong> ${Math.floor(segment.duration / 60)} minutes</p>
        `;

        new mapboxgl.Popup()
          .setLngLat([coordinates.lng, coordinates.lat])
          .setHTML(segmentDetails)
          .addTo(map);
      });

      // Change cursor when hovering over route
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
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
      
      // Reset refs
      layerIdsRef.current = [];
      sourceIdsRef.current = [];
    };
  }, [map, journey]);

  return null;
};

export default RouteLayer;
