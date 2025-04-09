
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import TripBaseView from '../trip-shared/TripBaseView';
import TripCardButtons from './TripCardButtons';
import TripCardContent from './TripCardContent';
import { useTripCardState } from '@/hooks/useTripCardState';

interface TripCardProps {
  trip: Trip;
  expanded?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  onExpand?: () => void;
}

/**
 * TripCard component displays a trip with optional expandable itinerary
 */
const TripCard: React.FC<TripCardProps> = ({ 
  trip,
  expanded = true,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove,
  onExpand
}) => {
  const { isItineraryVisible, toggleItinerary } = useTripCardState({ 
    initialExpanded: expanded 
  });
  
  // Handle card click event while preventing propagation from itinerary expander
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger onExpand if the click is not within an itinerary expander
    if (!onExpand) return;
    
    const isClickOnExpander = (e.target as Element).closest('.itinerary-expander');
    if (!isClickOnExpander) {
      onExpand();
    }
  };
  
  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md"
      onClick={handleCardClick}
    >
      <TripBaseView trip={trip} compact={!isItineraryVisible}>
        {/* Trip action buttons section */}
        {(onSave || (showRemoveButton && onRemove)) && (
          <TripCardButtons 
            tripId={trip.id} 
            isSaved={isSaved}
            onSave={onSave}
            showRemoveButton={showRemoveButton}
            onRemove={onRemove}
          />
        )}
        
        {/* Itinerary content section */}
        <TripCardContent 
          trip={trip}
          isItineraryVisible={isItineraryVisible}
          onToggleItinerary={toggleItinerary}
        />
      </TripBaseView>
    </Card>
  );
};

export default TripCard;
