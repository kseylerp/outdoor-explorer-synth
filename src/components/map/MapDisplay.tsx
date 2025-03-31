
import React, { useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { MapDisplayProps } from './types';
import MapStatus from './MapStatus';
import MapContent from './MapContent';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useIsMobile } from '@/hooks/use-mobile';

const MapDisplay: React.FC<MapDisplayProps> = ({
  journey,
  markers = [],
  center = { lng: -122.4194, lat: 37.7749 }, // Default to San Francisco
  interactive = false,
  showElevation = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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

  return (
    <Card className={`w-full h-full ${isMobile ? 'h-[calc(100vh-4rem)]' : 'min-h-[300px]'} overflow-hidden rounded-lg relative`}>
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      <MapStatus
        isLoading={loading && !map}
        isError={!!error && !map}
        isInteractive={mapInteractive}
        onEnableInteractiveMode={enableInteractiveMode}
      />
      
      {/* Only render child components when map is loaded */}
      {mapLoaded && map && (
        <MapContent 
          map={map}
          markers={markers}
          journey={journey}
          showElevation={showElevation}
        />
      )}
    </Card>
  );
};

export default MapDisplay;
