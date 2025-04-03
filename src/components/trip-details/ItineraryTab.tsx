
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItineraryDay } from '@/types/trips';
import DayDetails from './DayDetails';

interface ItineraryTabProps {
  itinerary: ItineraryDay[];
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  return (
    <div>
      {itinerary && itinerary.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">8-Day Itinerary</h3>
          
          <Tabs defaultValue={selectedDay.toString()} onValueChange={(val) => setSelectedDay(parseInt(val))}>
            <TabsList className="mb-4 bg-purple-100 flex flex-wrap">
              {/* Create 8 days even if the API only provided fewer */}
              {Array.from({ length: 8 }, (_, i) => i + 1).map((day) => (
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
              <TabsContent key={day.day} value={day.day.toString()}>
                <DayDetails day={day} />
              </TabsContent>
            ))}
            
            {/* Generate placeholder days for days not in the API */}
            {Array.from({ length: 8 }, (_, i) => i + 1)
              .filter(day => !itinerary.some(d => d.day === day))
              .map(day => (
                <TabsContent key={day} value={day.toString()}>
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
      ) : (
        <div className="text-center p-4 border border-gray-200 rounded-md">
          <p className="text-gray-500">No itinerary information available for this trip.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryTab;
