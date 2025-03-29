
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { MapDisplayProps } from './types';
import RouteLayer from './RouteLayer';
import MarkerLayer from './MarkerLayer';

const MapDisplay: React.FC<MapDisplayProps> = ({
  journey,
  markers = [],
  center = { lng: -122.4194, lat: 37.7749 }, // Default to San Francisco
  interactive = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { mapboxToken } = useMapboxToken();

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/kseylerp/cm8i0dbtn015s01sq8v5fh0xn',
      center: [center.lng, center.lat],
      zoom: 9,
      interactive: interactive
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, interactive, mapboxToken]);

  // We don't need the complex route/marker adding logic here anymore
  // Those are now handled by the specialized components

  return (
    <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg">
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      {/* Only render child components when map is loaded */}
      {mapLoaded && map.current && (
        <>
          {markers.length > 0 && (
            <MarkerLayer map={map.current} markers={markers} />
          )}
          
          {journey && (
            <RouteLayer map={map.current} journey={journey} />
          )}
        </>
      )}
    </Card>
  );
};

export default MapDisplay;
