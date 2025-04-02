
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';

// Define colors for different transportation modes
const modeColors = {
  walking: '#4CAF50',
  hiking: '#8BC34A',
  cycling: '#2196F3',
  driving: '#FF9800',
  transit: '#9C27B0',
  default: '#757575'
};

// Define line styles for different transportation modes
const modeLineStyles = {
  walking: {
    width: 4,
    dashArray: [1, 1]
  },
  hiking: {
    width: 3,
    dashArray: [2, 1]
  },
  cycling: {
    width: 3,
    dashArray: []
  },
  driving: {
    width: 5,
    dashArray: []
  },
  transit: {
    width: 5,
    dashArray: [3, 2]
  },
  default: {
    width: 4,
    dashArray: []
  }
};

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
    
    // Add the route line layer with enhanced styling
    const linePaint: mapboxgl.LinePaint = {
      'line-color': color,
      'line-width': lineStyle.width,
      'line-opacity': 0.8,
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0, color,
        0.5, adjustColorBrightness(color, 20),
        1, color
      ]
    };
    
    // Add dash array if specified
    if (lineStyle.dashArray && lineStyle.dashArray.length > 0) {
      linePaint['line-dasharray'] = lineStyle.dashArray;
    }
    
    // Add a glow effect to make lines more visible
    const glowLayerId = `${layerId}-glow`;
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

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number) {
  // Parse hex color to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + percent));
  g = Math.min(255, Math.max(0, g + percent));
  b = Math.min(255, Math.max(0, b + percent));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const addSegmentInteractions = (map: mapboxgl.Map, segment: Segment, layerId: string) => {
  // Format duration as hours and minutes
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} minutes`;
    }
  };
  
  // Format distance in kilometers or meters
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    } else {
      return `${Math.round(meters)} m`;
    }
  };
  
  // Create popup HTML content
  const createPopupContent = (segment: Segment): string => {
    const mode = segment.mode.charAt(0).toUpperCase() + segment.mode.slice(1);
    const distance = formatDistance(segment.distance);
    const duration = formatDuration(segment.duration);
    
    let html = `
      <div class="route-popup">
        <div class="route-popup-header">
          <div class="route-popup-title">${mode} Route</div>
        </div>
        <div class="route-popup-content">
          <div class="route-popup-from-to">
            <strong>From:</strong> ${segment.from}<br>
            <strong>To:</strong> ${segment.to}
          </div>
          <div class="route-popup-stats">
            <div class="route-popup-stat">
              <strong>Distance:</strong> ${distance}
            </div>
            <div class="route-popup-stat">
              <strong>Duration:</strong> ${duration}
            </div>
    `;
    
    // Add elevation gain if available
    if (segment.elevationGain) {
      html += `
        <div class="route-popup-stat">
          <strong>Elevation Gain:</strong> ${segment.elevationGain}m
        </div>
      `;
    }
    
    // Add terrain if available
    if (segment.terrain) {
      html += `
        <div class="route-popup-stat">
          <strong>Terrain:</strong> ${segment.terrain}
        </div>
      `;
    }
    
    // Add description if available
    if (segment.description) {
      html += `
        <div class="route-popup-description">
          ${segment.description}
        </div>
      `;
    }
    
    // Close divs
    html += `
          </div>
        </div>
      </div>
    `;
    
    return html;
  };
  
  // Add hover effect with enhanced visual feedback
  map.on('mouseenter', layerId, () => {
    map.getCanvas().style.cursor = 'pointer';
    
    // Highlight the route on hover
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-width', 
        modeLineStyles[segment.mode as keyof typeof modeLineStyles]?.width * 1.5 || 6);
    }
  });
  
  map.on('mouseleave', layerId, () => {
    map.getCanvas().style.cursor = '';
    
    // Reset route styling when mouse leaves
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-width', 
        modeLineStyles[segment.mode as keyof typeof modeLineStyles]?.width || 4);
    }
  });
  
  // Add click interaction to show popup with route details
  map.on('click', layerId, (e) => {
    if (!e.features || e.features.length === 0) return;
    
    const coordinates = e.lngLat;
    const popupContent = createPopupContent(segment);
    
    new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '320px'
    })
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });
};

export const addPopupStyles = () => {
  // Check if styles already exist to avoid duplicating
  if (document.getElementById('route-popup-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'route-popup-styles';
  styleElement.innerHTML = `
    .route-popup {
      font-family: 'Inter', system-ui, sans-serif;
      padding: 0;
      max-width: 280px;
    }
    
    .route-popup-header {
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
      background-color: #f7fafc;
    }
    
    .route-popup-title {
      font-weight: 600;
      font-size: 16px;
      color: #1a202c;
    }
    
    .route-popup-content {
      padding: 10px;
    }
    
    .route-popup-from-to {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .route-popup-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .route-popup-stat {
      line-height: 1.4;
    }
    
    .route-popup-description {
      font-size: 14px;
      line-height: 1.5;
      color: #4a5568;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      margin-top: 5px;
    }
    
    .mapboxgl-popup-content {
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  `;
  
  document.head.appendChild(styleElement);
};

export const removePopupStyles = () => {
  const styleElement = document.getElementById('route-popup-styles');
  if (styleElement) {
    styleElement.remove();
  }
};
