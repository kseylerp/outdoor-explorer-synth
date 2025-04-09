
import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ItineraryDay } from '@/types/trips';
import MealSection from './MealSection';
import AccommodationSection from './AccommodationSection';
import ActivitiesSection from './ActivitiesSection';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ItineraryDayItemProps {
  day: ItineraryDay;
  idx: number;
}

const ItineraryDayItem: React.FC<ItineraryDayItemProps> = ({ day, idx }) => {
  return (
    <AccordionItem 
      key={`day-${day.day}-${idx}`}
      value={`day-${day.day}`} 
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
    >
      <AccordionTrigger className="px-5 py-4 hover:no-underline bg-white group">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-800">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-lg text-gray-900 break-words">
              Day {day.day} - {day.title || 'Activities'}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {day.description}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-5 pb-5 pt-0">
        <div className="pl-[52px]">
          <div className="mb-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 mb-2">
              <Clock className="h-3 w-3 mr-1" /> Full day
            </Badge>
            
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-500">Notes</h4>
              <p className="text-sm text-gray-700">{day.description}</p>
            </div>
          </div>
          
          <MealSection meals={day.meals} />
          <AccommodationSection accommodations={day.accommodations} />
          
          <h4 className="text-lg font-medium mb-4">Activities</h4>
          <ActivitiesSection activities={day.activities} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ItineraryDayItem;
