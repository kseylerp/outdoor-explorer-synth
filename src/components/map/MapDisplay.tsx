
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
  const { mapboxToken, loading, error } = useMapboxToken();

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    // Verify token starts with pk. for public token
    if (!mapboxToken.startsWith('pk.')) {
      console.error('Invalid Mapbox token format - must be a public token (pk.*)');
      return;
    }
    
    console.log('Initializing map with valid public token');
    mapboxgl.accessToken = mapboxToken;
    
    try {
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
    } catch (e) {
      console.error('Error initializing map:', e);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, interactive, mapboxToken]);

  if (error && !mapboxToken) {
    return (
      <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500">Error loading map</p>
          <p className="text-sm text-gray-500">Please check your Mapbox configuration</p>
        </div>
      </Card>
    );
  }

  if (loading && !mapboxToken) {
    return (
      <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </Card>
    );
  }

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
