
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
  onExpand?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip,
  expanded = true,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove,
  onExpand
}) => {
  const [isItineraryVisible, setIsItineraryVisible] = useState(expanded);
  
  // Log complete trip data to ensure we're using everything available
  console.log('TripCard rendering with full trip data:', JSON.stringify(trip, null, 2));
  console.log('TripCard itinerary days:', trip.itinerary?.length || 0);
  
  // Handle the click on the card while preventing it from affecting the itinerary expander
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger onExpand if the click target is not part of the itinerary expander
    // Check if the click is within the itinerary expander
    const expanderElements = document.querySelectorAll('.itinerary-expander');
    for (let i = 0; i < expanderElements.length; i++) {
      if (expanderElements[i].contains(e.target as Node)) {
        // Click is inside an expander, so don't trigger onExpand
        return;
      }
    }
    
    // If we reach here, the click is not in an expander, so we can call onExpand
    if (onExpand) {
      onExpand();
    }
  };
  
  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md"
      onClick={handleCardClick}
    >
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
        <div className="itinerary-expander">
          <ItineraryExpander 
            isExpanded={isItineraryVisible}
            onToggle={() => setIsItineraryVisible(!isItineraryVisible)}
          >
            {trip.itinerary && trip.itinerary.length > 0 && (
              <TripItinerary itinerary={trip.itinerary} />
            )}
          </ItineraryExpander>
        </div>
      </TripBaseView>
    </Card>
  );
};

export default TripCard;
