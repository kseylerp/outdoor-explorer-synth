
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
  console.log('TripMapSection - journey:', trip.journey);
  
  // Safely check if journey bounds are valid
  const hasValidBounds = trip.journey?.bounds?.every(coord => 
    Array.isArray(coord) && 
    coord.length === 2 &&
    typeof coord[0] === 'number' && 
    typeof coord[1] === 'number' &&
    coord[1] >= -90 && coord[1] <= 90 // Latitude must be between -90 and 90
  );
  
  if (!hasValidBounds && trip.journey?.bounds) {
    console.warn('Invalid journey bounds detected:', trip.journey.bounds);
  }

  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200" style={{ height }}>
      <MapDisplay
        center={trip.mapCenter}
        markers={trip.markers}
        journey={hasValidBounds ? trip.journey : undefined}
        interactive={true}
        zoomLevel={9}
      />
    </div>
  );
};

export default TripMapSection;
