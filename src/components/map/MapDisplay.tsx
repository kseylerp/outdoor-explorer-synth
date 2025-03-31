
import React, { useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { MapDisplayProps } from './types';
import MapStatus from './MapStatus';
import MapContent from './MapContent';
import RouteTypeSelector from './RouteTypeSelector';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useIsMobile } from '@/hooks/use-mobile';

const MapDisplay: React.FC<MapDisplayProps> = ({
  journey,
  markers = [],
  center = { lng: -122.4194, lat: 37.7749 }, // Default to San Francisco
  interactive = false,
  routeType: initialRouteType = 'all',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [routeType, setRouteType] = useState(initialRouteType);
  
  const {
    map,
    mapLoaded,
    mapInteractive,
    loading,
    error,
    enableInteractiveMode
  } = useMapInitialization({
    mapContainer,
    center,
    interactive
  });

  // Determine if we should show the route selector
  const showRouteSelector = journey && 
                           journey.segments && 
                           journey.segments.length > 0 && 
                           journey.segments.some(segment => segment.mode);

  return (
    <Card className={`w-full h-full ${isMobile ? 'h-[calc(100vh-4rem)]' : 'min-h-[300px]'} overflow-hidden rounded-lg relative`}>
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      <MapStatus
        isLoading={loading && !map}
        isError={!!error && !map}
        isInteractive={mapInteractive}
        onEnableInteractiveMode={enableInteractiveMode}
      />
      
      {showRouteSelector && mapLoaded && (
        <RouteTypeSelector routeType={routeType} setRouteType={setRouteType} />
      )}
      
      {/* Only render child components when map is loaded */}
      {mapLoaded && map && (
        <MapContent 
          map={map}
          markers={markers}
          journey={journey}
          routeType={routeType}
        />
      )}
    </Card>
  );
};

export default MapDisplay;
