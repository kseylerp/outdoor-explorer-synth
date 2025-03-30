
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';

/**
 * Add popup styles to the document head
 */
export const addPopupStyles = (): void => {
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
};

/**
 * Remove popup styles from the document head
 */
export const removePopupStyles = (): void => {
  const styleElement = document.getElementById('route-popup-styles');
  if (styleElement) {
    styleElement.remove();
  }
};

/**
 * Format a segment's details for display in a popup
 */
export const createSegmentPopupHTML = (segment: Segment, coordinates: mapboxgl.LngLat): string => {
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
  
  return `
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
};
