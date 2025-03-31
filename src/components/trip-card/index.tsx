
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import { useNavigate } from 'react-router-dom';
import TripCardHeader from './TripCardHeader';
import TripCardMap from './TripCardMap';
import TripCardInfo from './TripCardInfo';
import TripCardButtons from './TripCardButtons';
import TripItinerary from './TripItinerary';

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
  
  const handleSaveTrip = () => {
    if (onSave) {
      onSave();
    } else {
      navigate(`/trip/${trip.id}`);
    }
  };
  
  const handleShareTrip = () => {
    // In a real app, this would open a sharing dialog
    navigator.clipboard.writeText(`Check out this amazing trip: ${trip.title}`);
    alert('Trip link copied to clipboard!');
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <TripCardHeader title={trip.title} description={trip.description} />
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <TripCardMap 
            center={trip.mapCenter}
            markers={trip.markers}
            journey={trip.journey}
          />
          
          <TripCardInfo 
            whyWeChoseThis={trip.whyWeChoseThis}
            duration={trip.duration}
            priceEstimate={trip.priceEstimate}
            location={trip.location}
            difficultyLevel={trip.difficultyLevel}
            suggestedGuides={trip.suggestedGuides}
          />
        </div>
        
        <TripCardButtons 
          isSaved={isSaved}
          onSave={handleSaveTrip}
          onShare={handleShareTrip}
          showRemoveButton={showRemoveButton}
          onRemove={onRemove}
        />
      </CardContent>
      
      {/* Display Itinerary directly in the card */}
      {trip.itinerary && trip.itinerary.length > 0 && (
        <TripItinerary itinerary={trip.itinerary} />
      )}
    </Card>
  );
};

export default TripCard;
