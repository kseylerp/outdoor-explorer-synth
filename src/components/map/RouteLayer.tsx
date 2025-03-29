
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
            properties: {
              distance: segment.distance,
              duration: segment.duration,
              mode: segment.mode,
              from: segment.from,
              to: segment.to
            },
            geometry: {
              type: 'LineString',
              coordinates: segment.geometry.coordinates
            }
          }
        });
      }
      
      // Add the route line
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
        
        // Add route information pop-up on hover
        map.on('mouseenter', layerId, (e) => {
          map.getCanvas().style.cursor = 'pointer';
          
          const coordinates = e.lngLat;
          const properties = map.getSource(sourceId)._data.properties;
          
          const distance = (properties.distance / 1000).toFixed(1);
          const duration = Math.round(properties.duration / 60);
          
          const html = `
            <div class="p-2">
              <div class="font-bold mb-1">${properties.from} → ${properties.to}</div>
              <div class="text-sm">
                <div>Mode: ${properties.mode}</div>
                <div>Distance: ${distance} km</div>
                <div>Duration: ${duration} min</div>
              </div>
            </div>
          `;
          
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map);
        });
        
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }
      
      // Add waypoints as markers
      if (segment.steps && segment.steps.length > 0) {
        // Start point marker (in different color)
        if (index === 0) {
          const startCoords = segment.geometry.coordinates[0];
          addWaypointMarker(map, startCoords, 'Start', 'start-marker-' + index, true);
        }
        
        // End point marker
        const endCoords = segment.geometry.coordinates[segment.geometry.coordinates.length - 1];
        const isLastSegment = index === journey.segments.length - 1;
        addWaypointMarker(map, endCoords, isLastSegment ? 'End' : segment.to, 'end-marker-' + index, isLastSegment);
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

    // Cleanup function - Fix for the error:
    // Only attempt to remove layers/sources if map is still valid
    return () => {
      // Check if map is still available and has the necessary methods
      if (!map || !map.getStyle || typeof map.getLayer !== 'function' || typeof map.getSource !== 'function') {
        console.log('Map not available for cleanup in RouteLayer');
        return;
      }
      
      try {
        // Safety check: only proceed if the map is still loaded and valid
        if (map && journey && map.loaded()) {
          journey.segments.forEach((_, index) => {
            const sourceId = `route-source-${index}`;
            const layerId = `route-${index}`;
            
            // Use safe checks before removing layers and sources
            if (map.getStyle() && map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
            
            if (map.getStyle() && map.getSource(sourceId)) {
              map.removeSource(sourceId);
            }
            
            // Remove markers
            removeWaypointMarker(map, 'start-marker-' + index);
            removeWaypointMarker(map, 'end-marker-' + index);
          });
          console.log('Successfully cleaned up route layers');
        }
      } catch (error) {
        // Catch any errors during cleanup to prevent app crashes
        console.error('Error cleaning up route layers:', error);
      }
    };
  }, [map, journey]);

  // Helper function to add a waypoint marker
  const addWaypointMarker = (
    map: mapboxgl.Map, 
    coordinates: number[], 
    name: string, 
    id: string, 
    isEndpoint: boolean
  ) => {
    try {
      // Create a marker element
      const el = document.createElement('div');
      el.className = 'waypoint-marker';
      el.id = id;
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = isEndpoint ? 
        (name === 'Start' ? '#4CAF50' : '#F44336') : 
        '#2196F3';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1)';
      
      // Add the marker to the map
      new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div>${name}</div>`))
        .addTo(map);
    } catch (error) {
      console.error('Error adding waypoint marker:', error);
    }
  };
  
  // Helper function to remove a waypoint marker
  const removeWaypointMarker = (map: mapboxgl.Map, id: string) => {
    try {
      const markerEl = document.getElementById(id);
      if (markerEl) {
        markerEl.remove();
      }
    } catch (error) {
      console.error('Error removing waypoint marker:', error);
    }
  };

  return null; // This is a behavior component, not a visual one
};

export default RouteLayer;
