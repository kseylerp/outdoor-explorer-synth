
import React, { useEffect } from 'react';
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
  // Calculate maximum day number to ensure we show all days
  const maxDays = itinerary && itinerary.length > 0 
    ? Math.max(...itinerary.map(day => day.day))
    : 1;
    
  // Use effect to populate days that are missing
  useEffect(() => {
    if (itinerary.length < maxDays) {
      console.log(`Itinerary has ${itinerary.length} days but should have ${maxDays} days`);
    }
  }, [itinerary, maxDays]);

  return (
    <div className="md:px-2">
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
        className="w-full"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-4 bg-purple-100 flex flex-nowrap w-auto">
            {/* Create tabs based on maxDays */}
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((day) => (
              <TabsTrigger 
                key={day} 
                value={day.toString()}
                className="data-[state=active]:bg-[#65558F] data-[state=active]:text-white whitespace-nowrap min-w-[80px]"
              >
                Day {day}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Render existing days from the API */}
        {itinerary.map((day) => (
          <TabsContent key={day.day} value={day.day.toString()} className="mt-2">
            <DayDetails day={day} />
          </TabsContent>
        ))}
        
        {/* Generate placeholder days for days not in the API */}
        {Array.from({ length: maxDays }, (_, i) => i + 1)
          .filter(day => !itinerary.some(d => d.day === day))
          .map(day => (
            <TabsContent key={day} value={day.toString()} className="mt-2">
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
