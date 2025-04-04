
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import TripItinerary from './TripItinerary';
import TripBaseView from '../trip-shared/TripBaseView';
import TripCardButtons from './TripCardButtons';
import ItineraryExpander from './ItineraryExpander';

interface TripCardProps {
  trip: Trip;
  expanded?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip,
  expanded = true,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove
}) => {
  const [isItineraryVisible, setIsItineraryVisible] = useState(expanded);
  
  // Add console.log to debug trip data
  console.log('TripCard rendering with trip:', trip);
  console.log('Trip itinerary:', trip.itinerary);
  
  // Get the maximum day number to ensure we show all days
  const maxDays = trip.itinerary && trip.itinerary.length > 0 
    ? Math.max(...trip.itinerary.map(day => day.day))
    : 0;
  
  console.log('Maximum days in itinerary:', maxDays);
  
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md">
      <TripBaseView trip={trip} compact={!isItineraryVisible}>
        {/* Buttons for saving/removing trips */}
        {(onSave || (showRemoveButton && onRemove)) && (
          <TripCardButtons 
            tripId={trip.id} 
            isSaved={isSaved}
            onSave={onSave}
            showRemoveButton={showRemoveButton}
            onRemove={onRemove}
          />
        )}
        
        {/* Itinerary expander */}
        <ItineraryExpander 
          isExpanded={isItineraryVisible}
          onToggle={() => setIsItineraryVisible(!isItineraryVisible)}
        >
          {trip.itinerary && trip.itinerary.length > 0 && (
            <TripItinerary itinerary={trip.itinerary} />
          )}
        </ItineraryExpander>
      </TripBaseView>
    </Card>
  );
};

export default TripCard;
