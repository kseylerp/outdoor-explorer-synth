
import { useState, useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { Coordinates } from '@/components/map/types';

interface UseMapInitializationProps {
  mapContainer: RefObject<HTMLDivElement>;
  center: Coordinates;
  interactive: boolean;
}

interface UseMapInitializationResult {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  mapInteractive: boolean;
  loading: boolean;
  error: Error | null;
  enableInteractiveMode: () => void;
}

export const useMapInitialization = ({
  mapContainer,
  center,
  interactive
}: UseMapInitializationProps): UseMapInitializationResult => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(interactive);
  const { mapboxToken, loading, error } = useMapboxToken();

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map) return;
    
    // Verify token starts with pk. for public token
    if (!mapboxToken.startsWith('pk.')) {
      console.error('Invalid Mapbox token format - must be a public token (pk.*)');
      return;
    }
    
    console.log('Initializing map with valid public token');
    mapboxgl.accessToken = mapboxToken;
    
    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v11', // Use outdoors style for better trail visibility
        center: [center.lng, center.lat],
        zoom: 9,
        interactive: mapInteractive
      });

      newMap.on('load', () => {
        setMapLoaded(true);
      });
      
      setMap(newMap);
      
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
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [center, interactive, mapInteractive, mapboxToken, mapContainer]);

  const enableInteractiveMode = () => {
    if (!mapInteractive && map) {
      setMapInteractive(true);
      map.scrollZoom.enable();
      map.boxZoom.enable();
      map.dragPan.enable();
      map.dragRotate.enable();
      map.keyboard.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
    }
  };

  return {
    map,
    mapLoaded,
    mapInteractive,
    loading,
    error,
    enableInteractiveMode
  };
};
