
import React from 'react';
import { ItineraryDay } from '@/types/trips';
import { Accordion } from '@/components/ui/accordion';
import ItineraryDayItem from './itinerary/ItineraryDayItem';

interface TripItineraryProps {
  itinerary: ItineraryDay[];
}

const TripItinerary: React.FC<TripItineraryProps> = ({ itinerary }) => {
  // Log the full itinerary data to debug any truncation issues
  console.log('TripItinerary rendering with itinerary:', JSON.stringify(itinerary, null, 2));
  console.log('Number of itinerary days:', itinerary?.length || 0);
  
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
        <p className="text-center text-gray-800 font-medium">No itinerary information available</p>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-gray-50 border-t border-gray-200">
      <div className="px-6 py-4">
        <h3 className="text-xl font-bold mb-4 text-purple-800">Complete Itinerary</h3>
        <Accordion type="multiple" className="space-y-6" defaultValue={["day-1"]}>
          {itinerary.map((day, idx) => (
            <ItineraryDayItem key={`day-${day.day}-${idx}`} day={day} idx={idx} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default TripItinerary;
