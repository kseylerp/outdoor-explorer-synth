
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItineraryDay } from '@/types/trips';
import DayDetails from './DayDetails';
import { Button } from '@/components/ui/button';
import { Tent } from 'lucide-react';
import CampgroundSearch from '../campground/CampgroundSearch';
import CampgroundDetails from '../campground/CampgroundDetails';
import { Campground } from '@/services/campground/campgroundService';
import { useToast } from '@/hooks/use-toast';

interface ItineraryTabProps {
  itinerary: ItineraryDay[];
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showCampgrounds, setShowCampgrounds] = useState(false);
  const [selectedCampground, setSelectedCampground] = useState<Campground | null>(null);
  const { toast } = useToast();

  const handleCampgroundSelected = (campground: Campground) => {
    setSelectedCampground(campground);
  };

  const handleBackToCampgrounds = () => {
    setSelectedCampground(null);
  };

  const handleBookCampground = (campground: Campground) => {
    // For now, just show a toast. This would be extended later.
    toast({
      title: "Booking initiated",
      description: `You're booking ${campground.name}. This feature is coming soon!`,
    });
  };

  // Determine the number of days to display based on actual itinerary data
  const maxDays = itinerary && itinerary.length > 0 
    ? Math.max(...itinerary.map(day => day.day))
    : 8; // Default to 8 days if no itinerary

  return (
    <div>
      {itinerary && itinerary.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{maxDays}-Day Itinerary</h3>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowCampgrounds(!showCampgrounds)}
            >
              <Tent className="h-4 w-4" />
              {showCampgrounds ? "Hide Campgrounds" : "Find Campgrounds"}
            </Button>
          </div>
          
          {showCampgrounds && !selectedCampground && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-md font-medium mb-3">Find Campgrounds Near Your Trip</h4>
              <CampgroundSearch 
                location={itinerary[0] ? { 
                  lat: 37.7749, // Default to SF - would come from trip data
                  lng: -122.4194 
                } : undefined}
                onCampgroundSelected={handleCampgroundSelected}
              />
            </div>
          )}
          
          {showCampgrounds && selectedCampground && (
            <div className="mb-6">
              <CampgroundDetails
                campground={selectedCampground}
                onBack={handleBackToCampgrounds}
                onBook={handleBookCampground}
              />
            </div>
          )}
          
          <Tabs defaultValue={selectedDay.toString()} onValueChange={(val) => setSelectedDay(parseInt(val))}>
            <TabsList className="mb-4 bg-purple-100 flex flex-wrap">
              {/* Create tabs based on actual days in the itinerary */}
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
              <TabsContent key={day.day} value={day.day.toString()}>
                <DayDetails day={day} />
              </TabsContent>
            ))}
            
            {/* Generate placeholder days for days not in the API */}
            {Array.from({ length: maxDays }, (_, i) => i + 1)
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
