
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Coffee, Utensils, Home, Map, AlertTriangle } from 'lucide-react';
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
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              <Clock className="h-3 w-3 mr-1" /> {day.travelDuration || 'Full day'}
            </Badge>
            {day.travelMode && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {day.travelMode}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pl-[52px]">
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-500">Overview</h5>
          <p className="text-gray-700">{day.description || 'No description available'}</p>
        </div>
        
        {/* Meals Section */}
        {day.meals && (Object.keys(day.meals).length > 0) && (
          <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h5 className="text-md font-medium mb-2 text-amber-800">Meals</h5>
            <div className="space-y-2">
              {day.meals.breakfast && (
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-amber-700" />
                  <p className="text-sm">
                    <span className="font-medium">Breakfast:</span> {day.meals.breakfast}
                  </p>
                </div>
              )}
              {day.meals.lunch && (
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-700" />
                  <p className="text-sm">
                    <span className="font-medium">Lunch:</span> {day.meals.lunch}
                  </p>
                </div>
              )}
              {day.meals.dinner && (
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-700" />
                  <p className="text-sm">
                    <span className="font-medium">Dinner:</span> {day.meals.dinner}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Accommodations Section */}
        {day.accommodations && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4 text-blue-700" />
              <h5 className="text-md font-medium text-blue-800">Accommodations</h5>
            </div>
            <p className="text-sm text-gray-700">{day.accommodations}</p>
          </div>
        )}
        
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
        
        {/* Extra information about special considerations for this day */}
        {day.activities.some(a => a.permitRequired) && (
          <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <h5 className="text-md font-medium text-amber-800">Permit Information</h5>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              One or more activities today require permits. Check the activity details for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayDetails;
