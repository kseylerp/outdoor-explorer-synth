
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { Trip } from '@/types/trips';
import TripCardButtons from '../trip-card/TripCardButtons';
import { Button } from '@/components/ui/button';

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
      <div className="flex items-start justify-between mb-4">
        <CardTitle className={compact ? "text-xl font-bold" : "text-2xl font-bold"}>{trip.title}</CardTitle>
        
        {onSave && (
          <Button 
            variant={isSaved ? "outline" : "default"}
            size="sm"
            onClick={onSave}
            className={`ml-2 ${isSaved ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600'}`}
          >
            {isSaved ? 'Saved' : 'Save Trip'}
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap items-center">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <MapPin className="h-3 w-3" /> {trip.location || 'Location not specified'}
          </Badge>
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <Clock className="h-3 w-3" /> {trip.duration || 'Duration not specified'}
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};

export default TripHeader;
