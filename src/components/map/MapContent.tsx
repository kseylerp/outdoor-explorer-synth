
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
  return (
    <>
      {markers.length > 0 && (
        <MarkerLayer map={map} markers={markers} />
      )}
      
      {journey && (
        <RouteLayer map={map} journey={journey} />
      )}
    </>
  );
};

export default MapContent;
