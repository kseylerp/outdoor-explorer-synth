
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
        const color = segment.mode === 'walking' ? '#9870FF' : '#574780';
        
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
            'line-width': 6,
            'line-opacity': 0.8,
            'line-dasharray': segment.mode === 'walking' ? [0, 0] : [2, 1]
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

    // Add click listeners for interactive segments with enhanced details
    journey.segments.forEach((segment, index) => {
      const layerId = `route-layer-${index}`;
      
      // Add click handler to show segment details
      map.on('click', layerId, (e) => {
        const coordinates = e.lngLat;
        
        // Format the duration in hours and minutes
        const hours = Math.floor(segment.duration / 3600);
        const minutes = Math.floor((segment.duration % 3600) / 60);
        const durationFormatted = hours > 0 
          ? `${hours}h ${minutes}m` 
          : `${minutes} minutes`;
        
        // Calculate pace if it's a walking segment
        const pace = segment.mode === 'walking' 
          ? (segment.duration / 60) / (segment.distance / 1000) 
          : null;
        
        const paceFormatted = pace 
          ? `${pace.toFixed(1)} min/km` 
          : '';
        
        // Elevation gain if provided
        const elevationInfo = segment.elevationGain 
          ? `<p class="text-sm"><strong>Elevation Gain:</strong> ${segment.elevationGain}m</p>` 
          : '';
        
        // Terrain type if provided
        const terrainInfo = segment.terrain 
          ? `<p class="text-sm"><strong>Terrain:</strong> ${segment.terrain}</p>` 
          : '';
        
        // Format distance in km with one decimal place
        const distanceFormatted = (segment.distance / 1000).toFixed(1);
        
        const segmentDetails = `
          <div class="route-popup">
            <h3 class="text-lg font-bold text-purple-800 mb-2">${segment.from} to ${segment.to}</h3>
            <div class="bg-purple-50 p-2 rounded mb-2">
              <p class="text-sm mb-1"><strong>Mode:</strong> ${segment.mode.charAt(0).toUpperCase() + segment.mode.slice(1)}</p>
              <p class="text-sm mb-1"><strong>Distance:</strong> ${distanceFormatted} km</p>
              <p class="text-sm mb-1"><strong>Duration:</strong> ${durationFormatted}</p>
              ${pace ? `<p class="text-sm mb-1"><strong>Pace:</strong> ${paceFormatted}</p>` : ''}
              ${elevationInfo}
              ${terrainInfo}
            </div>
            <p class="text-xs text-gray-600">${segment.description || ''}</p>
          </div>
        `;

        // Create or update popup with segment details
        new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          className: 'route-segment-popup'
        })
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

    // Add CSS for styled popups
    if (!document.getElementById('route-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'route-popup-styles';
      style.innerHTML = `
        .route-segment-popup .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 16px;
          border-left: 4px solid #9870FF;
        }
        .route-popup h3 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #574780;
        }
        .route-popup p {
          margin: 4px 0;
        }
      `;
      document.head.appendChild(style);
    }

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
      const styleElement = document.getElementById('route-popup-styles');
      if (styleElement) {
        styleElement.remove();
      }
      
      // Reset refs
      layerIdsRef.current = [];
      sourceIdsRef.current = [];
    };
  }, [map, journey]);

  return null;
};

export default RouteLayer;
