
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItineraryDay } from '@/types/trips';
import DayDetails from './DayDetails';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ItineraryDayTabsProps {
  itinerary: ItineraryDay[];
  selectedDay: number;
  onDayChange: (day: number) => void;
}

const ItineraryDayTabs: React.FC<ItineraryDayTabsProps> = ({ 
  itinerary,
  selectedDay,
  onDayChange
}) => {
  // Log itinerary data to debug any issues
  console.log('ItineraryDayTabs - Full itinerary:', JSON.stringify(itinerary, null, 2));
  console.log('ItineraryDayTabs - Day numbers:', itinerary?.map(day => day.day) || []);
  
  // Calculate maximum day number to ensure we show all days
  const maxDays = itinerary && itinerary.length > 0 
    ? Math.max(...itinerary.map(day => day.day))
    : 1;
    
  // Log the calculated max days
  console.log('ItineraryDayTabs - Max days calculated:', maxDays);
  console.log('ItineraryDayTabs - Itinerary length:', itinerary?.length || 0);

  return (
    <div>
      {itinerary.length < maxDays && (
        <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
          <AlertDescription>
            This trip is {maxDays} days long, but only {itinerary.length} days have detailed itineraries. 
            The remaining days show placeholder information.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs 
        defaultValue={selectedDay.toString()} 
        onValueChange={(val) => onDayChange(parseInt(val))}
      >
        <TabsList className="mb-4 bg-purple-100 flex flex-wrap">
          {/* Create tabs based on maxDays */}
          {Array.from({ length: maxDays }, (_, i) => i + 1).map((day) => (
            <TabsTrigger 
              key={day} 
              value={day.toString()}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Day {day}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Render existing days from the API */}
        {itinerary.map((day) => (
          <TabsContent key={`day-content-${day.day}`} value={day.day.toString()}>
            <DayDetails day={day} />
          </TabsContent>
        ))}
        
        {/* Generate placeholder days for days not in the API */}
        {Array.from({ length: maxDays }, (_, i) => i + 1)
          .filter(day => !itinerary.some(d => d.day === day))
          .map(day => (
            <TabsContent key={`day-placeholder-${day}`} value={day.toString()}>
              <DayDetails 
                day={{
                  day,
                  title: `Day ${day} - Adventure Continues`,
                  description: "Details for this day are being finalized. Contact your trip organizer for more information.",
                  activities: [
                    {
                      name: "Activities being planned",
                      type: "Hiking",
                      duration: "Full day",
                      description: "This day's activities are currently being planned. Expect similar experiences to other days on the itinerary.",
                      permitRequired: false
                    }
                  ]
                }}
              />
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default ItineraryDayTabs;
