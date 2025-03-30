
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';

interface TripDetailsProps {
  trip: Trip | undefined;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  if (!trip) return null;
  
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-2">Trip Details</h3>
      <div className="space-y-2 text-sm">
        {trip.location && <p><strong>Location:</strong> {trip.location}</p>}
        {trip.duration && <p><strong>Duration:</strong> {trip.duration}</p>}
        {trip.difficultyLevel && <p><strong>Difficulty:</strong> {trip.difficultyLevel}</p>}
      </div>
    </Card>
  );
};

export default TripDetails;
