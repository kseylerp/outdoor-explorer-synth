
import React from 'react';
import { Trip } from '@/types/trips';
import TripItinerary from './TripItinerary';
import ItineraryExpander from './ItineraryExpander';

interface TripCardContentProps {
  trip: Trip;
  isItineraryVisible: boolean;
  onToggleItinerary: () => void;
}

/**
 * Renders the expandable itinerary section of a trip card
 */
const TripCardContent: React.FC<TripCardContentProps> = ({ 
  trip, 
  isItineraryVisible, 
  onToggleItinerary 
}) => {
  const hasItinerary = trip.itinerary && trip.itinerary.length > 0;
  
  return (
    <div className="itinerary-expander">
      <ItineraryExpander 
        isExpanded={isItineraryVisible}
        onToggle={onToggleItinerary}
      >
        {hasItinerary && <TripItinerary itinerary={trip.itinerary} />}
      </ItineraryExpander>
    </div>
  );
};

export default TripCardContent;
