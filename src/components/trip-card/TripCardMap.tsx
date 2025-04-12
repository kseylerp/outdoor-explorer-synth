
import React from 'react';
import MapDisplay from '@/components/MapDisplay';
import { Coordinates, Journey } from '@/types/trips';

interface TripCardMapProps {
  center: Coordinates;
  markers?: Array<{
    name: string;
    coordinates: Coordinates;
    description?: string;
    elevation?: string | number;
    details?: string;
  }>;
  journey?: Journey;
  routeType?: string;
}

const TripCardMap: React.FC<TripCardMapProps> = ({ center, markers, journey, routeType = 'all' }) => {
  // Remove journey routes for cleaner map display
  const cleanJourney = journey ? { ...journey, segments: [] } : undefined;
  
  return (
    <div className="h-[180px] w-full sm:w-1/2">
      <MapDisplay 
        center={center}
        markers={markers}
        journey={cleanJourney}
        interactive={true}
        routeType={routeType}
        zoomLevel={11}
      />
    </div>
  );
};

export default TripCardMap;
