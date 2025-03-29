
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
  const [mapInteractive, setMapInteractive] = useState(interactive);
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
        style: 'mapbox://styles/mapbox/outdoors-v11', // Use outdoors style for better trail visibility
        center: [center.lng, center.lat],
        zoom: 9,
        interactive: mapInteractive
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });
      
      // Add click handler to enable interactive mode
      if (interactive && !mapInteractive) {
        mapContainer.current.addEventListener('click', enableInteractiveMode);
      }
    } catch (e) {
      console.error('Error initializing map:', e);
    }

    return () => {
      if (mapContainer.current) {
        mapContainer.current.removeEventListener('click', enableInteractiveMode);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, interactive, mapInteractive, mapboxToken]);

  const enableInteractiveMode = () => {
    if (!mapInteractive && map.current) {
      setMapInteractive(true);
      map.current.scrollZoom.enable();
      map.current.boxZoom.enable();
      map.current.dragPan.enable();
      map.current.dragRotate.enable();
      map.current.keyboard.enable();
      map.current.doubleClickZoom.enable();
      map.current.touchZoomRotate.enable();
    }
  };

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
    <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg relative">
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      {!mapInteractive && (
        <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center cursor-pointer z-10">
          <div className="bg-white bg-opacity-90 rounded-md px-3 py-2 text-sm font-medium text-gray-700 shadow-md pointer-events-none">
            Click to interact with map
          </div>
        </div>
      )}
      
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
