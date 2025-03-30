
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
  
  // Validate journey is properly formed before rendering
  const isValidJourney = journey && 
    journey.segments && 
    Array.isArray(journey.segments) && 
    journey.segments.length > 0 &&
    journey.bounds && 
    Array.isArray(journey.bounds) && 
    journey.bounds.length === 2;
    
  return (
    <>
      {validMarkers.length > 0 && (
        <MarkerLayer map={map} markers={validMarkers} />
      )}
      
      {isValidJourney && (
        <RouteLayer map={map} journey={journey} />
      )}
    </>
  );
};

export default MapContent;
