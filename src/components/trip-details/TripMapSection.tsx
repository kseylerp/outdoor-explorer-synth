
import React, { useState } from 'react';
import MapDisplay from '@/components/MapDisplay';
import { Trip } from '@/types/trips';

interface TripMapSectionProps {
  trip: Trip;
}

const TripMapSection: React.FC<TripMapSectionProps> = ({ trip }) => {
  const [routeType, setRouteType] = useState('all');

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Interactive Map</h3>
      <div className="h-[400px] w-full">
        <MapDisplay 
          center={trip.mapCenter}
          markers={trip.markers}
          journey={trip.journey}
          interactive={true}
          routeType={routeType}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Click on the map to enable interaction. Click routes or markers for detailed information.</p>
    </div>
  );
};

export default TripMapSection;
