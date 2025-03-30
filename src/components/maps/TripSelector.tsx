
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trip } from '@/types/trips';

interface TripSelectorProps {
  savedTrips: Trip[];
  selectedTripId: string;
  setSelectedTripId: (id: string) => void;
}

const TripSelector: React.FC<TripSelectorProps> = ({ 
  savedTrips, 
  selectedTripId, 
  setSelectedTripId 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Adventure</label>
      <Select value={selectedTripId} onValueChange={setSelectedTripId}>
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
    </div>
  );
};

export default TripSelector;
