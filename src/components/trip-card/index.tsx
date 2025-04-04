
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import TripItinerary from './TripItinerary';
import TripBaseView from '../trip-shared/TripBaseView';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  expanded = true, // Default to expanded
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove
}) => {
  const [isItineraryVisible, setIsItineraryVisible] = useState(expanded);
  
  // Add console.log to debug trip data
  console.log('TripCard rendering with trip:', trip);
  console.log('Trip itinerary:', trip.itinerary);
  
  const toggleItinerary = () => {
    setIsItineraryVisible(!isItineraryVisible);
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md">
      <TripBaseView trip={trip} compact={!isItineraryVisible}>
        <div className="flex justify-center mt-4">
          <Button
            onClick={toggleItinerary}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isItineraryVisible ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Itinerary
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Itinerary
              </>
            )}
          </Button>
        </div>
        
        {/* Display Itinerary directly in the card */}
        {isItineraryVisible && trip.itinerary && trip.itinerary.length > 0 && (
          <TripItinerary itinerary={trip.itinerary} />
        )}
      </TripBaseView>
    </Card>
  );
};

export default TripCard;
