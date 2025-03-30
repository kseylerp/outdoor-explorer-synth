
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import { Info } from 'lucide-react';

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
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-purple-500" />
        <h3 className="font-medium">Trip Details</h3>
      </div>
      <div className="space-y-2 text-sm">
        {renderMissingOrValue(trip.location, 'Location')}
        {renderMissingOrValue(trip.duration, 'Duration')}
        {renderMissingOrValue(trip.difficultyLevel, 'Difficulty')}
        {renderMissingOrValue(trip.priceEstimate?.toString(), 'Price Estimate')}
      </div>
    </Card>
  );
};

export default TripDetails;
