
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { modeColors, modeLineStyles } from './style-constants';
import { adjustColorBrightness } from './color-utils';

/**
 * Adds a route segment to the map
 */
export const addRouteSegment = (map: mapboxgl.Map, segment: Segment, index: number) => {
  if (!segment.geometry || !segment.geometry.coordinates || segment.geometry.coordinates.length < 2) {
    console.warn('Segment has invalid geometry:', segment);
    return {};
  }

  try {
    // Get color and line style based on transportation mode
    const mode = segment.mode || 'default';
    const color = modeColors[mode as keyof typeof modeColors] || modeColors.default;
    const lineStyle = modeLineStyles[mode as keyof typeof modeLineStyles] || modeLineStyles.default;
    
    // Create unique IDs for this segment
    const sourceId = `route-source-${index}`;
    const layerId = `route-layer-${index}`;
    const glowLayerId = `${layerId}-glow`;
    
    // Check if these layers already exist and remove them first
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    
    if (map.getLayer(glowLayerId)) {
      map.removeLayer(glowLayerId);
    }
    
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
    
    // Add the route line source
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          mode: segment.mode,
          description: segment.description || `${segment.mode} route from ${segment.from} to ${segment.to}`,
          from: segment.from,
          to: segment.to,
          distance: segment.distance,
          duration: segment.duration,
          elevationGain: segment.elevationGain,
          terrain: segment.terrain
        },
        geometry: {
          type: 'LineString',
          coordinates: segment.geometry.coordinates
        }
      }
    });
    
    // Add a glow effect to make lines more visible
    map.addLayer({
      id: glowLayerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        visibility: 'visible'
      },
      paint: {
        'line-color': adjustColorBrightness(color, 40),
        'line-width': lineStyle.width + 4,
        'line-opacity': 0.4,
        'line-blur': 3
      }
    });
    
    // Add the route line layer with enhanced styling
    const linePaint: mapboxgl.LinePaint = {
      'line-color': color,
      'line-width': lineStyle.width,
      'line-opacity': 0.8
    };
    
    // Add dash array if specified
    if (lineStyle.dashArray && lineStyle.dashArray.length > 0) {
      linePaint['line-dasharray'] = lineStyle.dashArray;
    }
    
    // Add the line layer
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: linePaint
    });
    
    return { sourceId, layerId };
  } catch (error) {
    console.error('Error adding route segment:', error);
    return {};
  }
};
