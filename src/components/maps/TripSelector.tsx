
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trip } from '@/types/trips';

interface TripSelectorProps {
  savedTrips: Trip[];
  selectedTripId: string;
  setSelectedTripId: (id: string) => void;
  isLoading?: boolean; // Add optional isLoading prop
}

const TripSelector: React.FC<TripSelectorProps> = ({ 
  savedTrips, 
  selectedTripId, 
  setSelectedTripId,
  isLoading = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Adventure</label>
      <Select value={selectedTripId} onValueChange={setSelectedTripId} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a saved trip" />
        </SelectTrigger>
        <SelectContent>
          {savedTrips.map(trip => (
            <SelectItem key={trip.id} value={trip.id}>
              {trip.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && (
        <p className="text-xs text-muted-foreground mt-1">Loading trip details...</p>
      )}
    </div>
  );
};

export default TripSelector;
