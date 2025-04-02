
import { Segment } from '@/types/trips';

/**
 * Format duration as hours and minutes
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes} minutes`;
  }
};

/**
 * Format distance in kilometers or meters
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  } else {
    return `${Math.round(meters)} m`;
  }
};

/**
 * Create popup HTML content for a route segment
 */
export const createPopupContent = (segment: Segment): string => {
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
