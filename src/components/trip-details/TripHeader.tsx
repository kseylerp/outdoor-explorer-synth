
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { Trip } from '@/types/trips';

interface TripHeaderProps {
  trip: Trip;
}

const TripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{trip.title}</CardTitle>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline" className="flex gap-1 items-center text-sm">
          <MapPin className="h-3 w-3" /> {trip.location || 'Location not specified'}
        </Badge>
        <Badge variant="outline" className="flex gap-1 items-center text-sm">
          <Clock className="h-3 w-3" /> {trip.duration || 'Duration not specified'}
        </Badge>
        <Badge className="bg-purple-600 text-white">{trip.difficultyLevel || 'Difficulty unknown'}</Badge>
      </div>
    </CardHeader>
  );
};

export default TripHeader;
