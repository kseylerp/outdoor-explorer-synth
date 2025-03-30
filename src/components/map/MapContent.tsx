
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
  
  // Check if journey exists and has minimal required properties
  const hasValidJourney = journey && 
    journey.segments && 
    Array.isArray(journey.segments) && 
    journey.segments.length > 0;
    
  // Filter segments by route type if specified
  const filteredJourney = hasValidJourney && routeType !== 'all' 
    ? {
        ...journey,
        segments: journey.segments.filter(segment => {
          // Map the route type to segment mode
          switch(routeType) {
            case 'walk':
              return segment.mode === 'walking';
            case 'bike':
              return segment.mode === 'cycling';
            case 'drive':
              return segment.mode === 'driving';
            case 'transit':
              return segment.mode === 'transit';
            default:
              return true;
          }
        })
      }
    : journey;
  
  return (
    <>
      {validMarkers.length > 0 && (
        <MarkerLayer map={map} markers={validMarkers} />
      )}
      
      {hasValidJourney && (
        <RouteLayer map={map} journey={filteredJourney} />
      )}
    </>
  );
};

export default MapContent;
