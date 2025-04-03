
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { ItineraryDay } from '@/types/trips';
import ActivityCard from './ActivityCard';

interface DayDetailsProps {
  day: ItineraryDay;
}

const DayDetails: React.FC<DayDetailsProps> = ({ day }) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-800">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-1 text-purple-800">{day.title || `Day ${day.day}`}</h4>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Clock className="h-3 w-3 mr-1" /> Full day
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 pl-[52px]">
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-500">Notes</h5>
          <p className="text-gray-700">{day.description || 'No description available'}</p>
        </div>
        
        <h4 className="text-lg font-medium mb-4">Activities</h4>
        
        {day.activities && day.activities.length > 0 ? (
          <div className="space-y-4">
            {day.activities.map((activity, idx) => (
              <ActivityCard 
                key={idx} 
                activity={activity} 
                isLast={idx === day.activities.length - 1} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center p-4">No activities available for this day.</p>
        )}
      </div>
    </div>
  );
};

export default DayDetails;
