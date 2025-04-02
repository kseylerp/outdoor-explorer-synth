
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { modeLineStyles } from './style-constants';
import { createPopupContent } from './popup-content-utils';

/**
 * Adds interactive behavior to route segments
 */
export const addSegmentInteractions = (map: mapboxgl.Map, segment: Segment, layerId: string) => {
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
