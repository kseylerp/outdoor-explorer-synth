
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import { useNavigate } from 'react-router-dom';
import TripCardButtons from './TripCardButtons';
import TripItinerary from './TripItinerary';
import TripBaseView from '../trip-shared/TripBaseView';

interface TripCardProps {
  trip: Trip;
  expanded?: boolean;
  onExpand?: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip,
  expanded = false,
  onExpand,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove
}) => {
  const navigate = useNavigate();
  const [isItineraryVisible, setIsItineraryVisible] = useState(expanded);
  
  // Add console.log to debug trip data
  console.log('TripCard rendering with trip:', trip);
  console.log('Trip itinerary:', trip.itinerary);
  
  const handleSaveTrip = () => {
    if (onSave) {
      onSave();
    } else {
      navigate(`/trip/${trip.id}`);
    }
  };
  
  const toggleItinerary = () => {
    setIsItineraryVisible(!isItineraryVisible);
    if (onExpand) {
      onExpand();
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md">
      <TripBaseView trip={trip} compact={true}>
        <TripCardButtons 
          tripId={trip.id}
          isSaved={isSaved}
          onSave={handleSaveTrip}
          showRemoveButton={showRemoveButton}
          onRemove={onRemove}
          onExpand={toggleItinerary}
          isExpanded={isItineraryVisible}
        />
        
        {/* Display Itinerary directly in the card */}
        {isItineraryVisible && trip.itinerary && trip.itinerary.length > 0 && (
          <TripItinerary itinerary={trip.itinerary} />
        )}
      </TripBaseView>
    </Card>
  );
};

export default TripCard;
