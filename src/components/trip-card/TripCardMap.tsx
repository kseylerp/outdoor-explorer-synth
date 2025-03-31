
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
}

const TripCardMap: React.FC<TripCardMapProps> = ({ center, markers, journey }) => {
  return (
    <div className="h-[200px] w-full sm:w-1/2">
      <MapDisplay 
        center={center}
        markers={markers}
        journey={journey}
        interactive={true}
        showElevation={true}
      />
    </div>
  );
};

export default TripCardMap;
