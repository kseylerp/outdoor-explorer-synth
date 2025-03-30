
import React from 'react';
import mapboxgl from 'mapbox-gl';
import MarkerLayer from './MarkerLayer';
import RouteLayer from './RouteLayer';
import { Journey } from '@/types/trips';
import { MapMarker } from './types';

interface MapContentProps {
  map: mapboxgl.Map;
  markers?: MapMarker[];
  journey?: Journey;
}

const MapContent: React.FC<MapContentProps> = ({ map, markers = [], journey }) => {
  // Validate markers are properly formed before rendering
  const validMarkers = Array.isArray(markers) ? markers.filter(marker => 
    marker && marker.coordinates && 
    typeof marker.coordinates.lng === 'number' && 
    typeof marker.coordinates.lat === 'number'
  ) : [];
  
  // Check if journey exists and has minimal required properties
  const hasValidJourney = journey && 
    journey.segments && 
    Array.isArray(journey.segments) && 
    journey.segments.length > 0;
    
  // Log warning if journey is missing required properties
  if (journey && (!journey.segments || !Array.isArray(journey.segments))) {
    console.warn("Journey is missing required 'segments' array or it's not properly formatted", journey);
  }
  
  // Log warning if journey is missing bounds
  if (journey && (!journey.bounds || !Array.isArray(journey.bounds))) {
    console.warn("Journey is missing required 'bounds' property or it's not properly formatted", journey);
  }
  
  return (
    <>
      {validMarkers.length > 0 && (
        <MarkerLayer map={map} markers={validMarkers} />
      )}
      
      {hasValidJourney && (
        <RouteLayer map={map} journey={journey} />
      )}
    </>
  );
};

export default MapContent;
