
import mapboxgl from 'mapbox-gl';
import { Coordinates } from './types';

// Create a simple marker element
export const createMarkerElement = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundColor = '#4A7B9D';
  el.style.width = '15px';
  el.style.height = '15px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  return el;
};

// Helper to get color for different transportation modes
export const getModeColor = (mode: string): string => {
  const colors: Record<string, string> = {
    driving: '#3887be', // blue
    walking: '#56B870', // green
    cycling: '#f9886c', // orange
    transit: '#9B59B6'  // purple
  };
  
  return colors[mode] || '#000';
};

// Helper to safely convert bounds to LngLatBoundsLike format
export const safelyConvertBounds = (bounds: number[][]): mapboxgl.LngLatBoundsLike | undefined => {
  if (!bounds || bounds.length < 2) return undefined;
  
  // Ensure each bound is a valid [lng, lat] pair
  const sw = bounds[0];
  const ne = bounds[1];
  
  if (!Array.isArray(sw) || !Array.isArray(ne) || sw.length < 2 || ne.length < 2) {
    return undefined;
  }
  
  return [
    [sw[0], sw[1]] as [number, number], 
    [ne[0], ne[1]] as [number, number]
  ];
};

// Convert coordinates from our format to mapboxgl.LngLat
export const coordinatesToLngLat = (coords: Coordinates): mapboxgl.LngLat => {
  return new mapboxgl.LngLat(coords.lng, coords.lat);
};
