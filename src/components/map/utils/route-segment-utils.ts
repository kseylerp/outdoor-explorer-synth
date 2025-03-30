
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { createSegmentPopupHTML } from './popup-utils';

/**
 * Add a route segment to the map
 */
export const addRouteSegment = (
  map: mapboxgl.Map,
  segment: Segment,
  index: number
): { sourceId: string; layerId: string } => {
  if (!segment.geometry || !segment.geometry.coordinates) {
    return { sourceId: '', layerId: '' };
  }

  const sourceId = `route-source-${index}`;
  const layerId = `route-layer-${index}`;

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

  return { sourceId, layerId };
};

/**
 * Add click and hover interactions to a route segment
 */
export const addSegmentInteractions = (
  map: mapboxgl.Map,
  segment: Segment,
  layerId: string
): void => {
  // Add click handler to show segment details
  map.on('click', layerId, (e) => {
    const coordinates = e.lngLat;
    const popupHTML = createSegmentPopupHTML(segment, coordinates);

    // Create or update popup with segment details
    new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px',
      className: 'route-segment-popup'
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setHTML(popupHTML)
      .addTo(map);
  });

  // Change cursor when hovering over route
  map.on('mouseenter', layerId, () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', layerId, () => {
    map.getCanvas().style.cursor = '';
  });
};
