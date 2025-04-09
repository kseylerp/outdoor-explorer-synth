
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { ItineraryDay } from '@/types/trips';

interface DayOverviewProps {
  day: ItineraryDay;
}

const DayOverview: React.FC<DayOverviewProps> = ({ day }) => {
  return (
    <>
      <div className="flex items-center gap-3 -ml-[52px]">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-800">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-1 text-purple-800">{day.title || `Day ${day.day}`}</h4>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Clock className="h-3 w-3 mr-1" /> {day.travelDuration || 'Full day'}
          </Badge>
          {day.travelMode && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 ml-2">
              {day.travelMode}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-4 mb-6">
        <h5 className="text-sm font-medium text-gray-500">Overview</h5>
        <p className="text-gray-700">{day.description || 'No description available'}</p>
      </div>
    </>
  );
};

export default DayOverview;
