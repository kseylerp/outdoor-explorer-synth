
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { Trip } from '@/types/trips';
import TripCardButtons from '../trip-card/TripCardButtons';

interface TripHeaderProps {
  trip: Trip;
  compact?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
}

const TripHeader: React.FC<TripHeaderProps> = ({ 
  trip, 
  compact = false,
  onSave,
  isSaved = false
}) => {
  return (
    <CardHeader>
      <CardTitle className={compact ? "text-xl font-bold" : "text-2xl font-bold"}>{trip.title}</CardTitle>
      <div className="flex flex-wrap items-center justify-between mt-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <MapPin className="h-3 w-3" /> {trip.location || 'Location not specified'}
          </Badge>
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <Clock className="h-3 w-3" /> {trip.duration || 'Duration not specified'}
          </Badge>
        </div>
        
        {onSave && (
          <div className="mt-0">
            <TripCardButtons 
              tripId={trip.id} 
              isSaved={isSaved}
              onSave={onSave}
              showRemoveButton={false}
              compactMode={true}
            />
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default TripHeader;
