
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Journey } from '@/types/trips';
import { getModeColor, safelyConvertBounds } from './map-utils';

interface RouteLayerProps {
  map: mapboxgl.Map;
  journey?: Journey;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ map, journey }) => {
  useEffect(() => {
    if (!map || !journey) return;
    
    // Remove previous routes
    journey.segments.forEach((_, index) => {
      const sourceId = `route-source-${index}`;
      const layerId = `route-${index}`;
      
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    });

    // Add each segment as a separate layer
    journey.segments.forEach((segment, index) => {
      // Create a GeoJSON source for this segment
      const sourceId = `route-source-${index}`;
      const layerId = `route-${segment.mode}-${index}`;
      
      const color = getModeColor(segment.mode);
      
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
      }
      
      if (!map.getLayer(layerId)) {
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
            'line-width': 5,
            'line-opacity': 0.8
          }
        });
      }
    });

    // Fit map to journey bounds if provided
    if (journey.bounds) {
      const mapBounds = safelyConvertBounds(journey.bounds);
      
      if (mapBounds) {
        map.fitBounds(mapBounds, {
          padding: 50
        });
      }
    }

    // Cleanup function
    return () => {
      if (!map) return;
      
      journey.segments.forEach((_, index) => {
        const sourceId = `route-source-${index}`;
        const layerId = `route-${index}`;
        
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
    };
  }, [map, journey]);

  return null; // This is a behavior component, not a visual one
};

export default RouteLayer;
