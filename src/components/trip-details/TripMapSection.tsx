
import React, { useEffect, useRef } from 'react';
import MapDisplay from '@/components/MapDisplay';
import { Trip } from '@/types/trips';

interface TripMapSectionProps {
  trip: Trip;
  height?: string;
}

const TripMapSection: React.FC<TripMapSectionProps> = ({ trip, height = "250px" }) => {
  // Add console logging to debug map data
  console.log('TripMapSection - mapCenter:', trip.mapCenter);
  console.log('TripMapSection - markers:', trip.markers);
  console.log('TripMapSection - journey:', trip.journey);
  
  // Reference to ensure all coordinates are within view
  const mapRef = useRef(null);
  
  // Remove any routing lines if present
  useEffect(() => {
    if (trip.journey) {
      // Safety check: We don't want to show routing lines in this view
      const modifiedJourney = { ...trip.journey };
      modifiedJourney.segments = [];
      trip.journey = modifiedJourney;
    }
  }, [trip]);
  
  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200" style={{ height }}>
      <MapDisplay
        center={trip.mapCenter}
        markers={trip.markers}
        journey={trip.journey}
        interactive={true}
        zoomLevel={11}
      />
    </div>
  );
};

export default TripMapSection;
