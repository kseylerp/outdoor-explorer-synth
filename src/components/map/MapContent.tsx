
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
  routeType?: string;
}

const MapContent: React.FC<MapContentProps> = ({ map, markers = [], journey, routeType = 'all' }) => {
  // Validate markers are properly formed before rendering
  const validMarkers = Array.isArray(markers) ? markers.filter(marker => 
    marker && marker.coordinates && 
    typeof marker.coordinates.lng === 'number' && 
    typeof marker.coordinates.lat === 'number'
  ) : [];
  
  // All segments will be displayed with different styling instead of filtering
  // We'll use the routeType just for informational purposes in the UI
  const hasValidJourney = journey && 
    journey.segments && 
    Array.isArray(journey.segments) && 
    journey.segments.length > 0;
    
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
