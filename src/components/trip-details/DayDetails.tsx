
import React from 'react';
import { ItineraryDay } from '@/types/trips';
import DayOverview from './DayOverview';
import MealsSection from './MealsSection';
import ActivitySection from './ActivitySection';
import AccommodationSection from '../trip-card/itinerary/AccommodationSection';

interface DayDetailsProps {
  day: ItineraryDay;
}

const DayDetails: React.FC<DayDetailsProps> = ({ day }) => {
  return (
    <div>
      <div className="pl-[52px] mt-4">
        <DayOverview day={day} />
        
        {/* Meals Section */}
        {day.meals && <MealsSection meals={day.meals} />}
        
        {/* Accommodations Section */}
        {day.accommodations && <AccommodationSection accommodations={day.accommodations} />}
        
        <h4 className="text-lg font-medium mb-4">Activities</h4>
        <ActivitySection activities={day.activities} />
      </div>
    </div>
  );
};

export default DayDetails;
