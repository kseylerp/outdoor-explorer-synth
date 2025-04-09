
import React from 'react';
import MapDisplay from '@/components/MapDisplay';
import { Trip } from '@/types/trips';

interface TripMapSectionProps {
  trip: Trip;
  height?: string;
}

const TripMapSection: React.FC<TripMapSectionProps> = ({ trip, height = "300px" }) => {
  // Add console logging to debug map data
  console.log('TripMapSection - mapCenter:', trip.mapCenter);
  console.log('TripMapSection - markers:', trip.markers);
  
  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200" style={{ height }}>
      <MapDisplay
        center={trip.mapCenter}
        markers={trip.markers}
        // Temporarily removing journey to disable route display
        // journey={trip.journey}
        interactive={true}
        zoomLevel={9}
      />
    </div>
  );
};

export default TripMapSection;
