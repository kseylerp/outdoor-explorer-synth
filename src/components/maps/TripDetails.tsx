
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';

interface TripDetailsProps {
  trip: Trip | undefined;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  if (!trip) return null;
  
  const renderMissingOrValue = (value: string | undefined | null, label: string) => {
    if (!value) {
      return (
        <p>
          <strong>{label}:</strong> <span className="text-red-500">Missing</span>
        </p>
      );
    }
    return <p><strong>{label}:</strong> {value}</p>;
  };
  
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-2">Trip Details</h3>
      <div className="space-y-2 text-sm">
        {renderMissingOrValue(trip.location, 'Location')}
        {renderMissingOrValue(trip.duration, 'Duration')}
        {renderMissingOrValue(trip.difficultyLevel, 'Difficulty')}
      </div>
    </Card>
  );
};

export default TripDetails;
