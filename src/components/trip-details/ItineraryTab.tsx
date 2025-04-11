
import React, { useState } from 'react';
import { ItineraryDay, Journey } from '@/types/trips';
import { Button } from '@/components/ui/button';
import { Map, Tent } from 'lucide-react';
import JourneyInfo from './JourneyInfo';
import CampgroundSection from './CampgroundSection';
import ItineraryDayTabs from './ItineraryDayTabs';

interface ItineraryTabProps {
  itinerary: ItineraryDay[];
  journey?: Journey;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary, journey }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showCampgrounds, setShowCampgrounds] = useState(false);
  const [showJourneyInfo, setShowJourneyInfo] = useState(false);

  // Add console logs to debug the data
  console.log('ItineraryTab - itinerary:', itinerary);
  console.log('ItineraryTab - journey:', journey);

  return (
    <div>
      {itinerary && itinerary.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {itinerary.length > 0 ? `${Math.max(...itinerary.map(day => day.day))}-Day Itinerary` : 'Itinerary'}
            </h3>
            <div className="flex gap-2">
              {journey && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowJourneyInfo(!showJourneyInfo)}
                >
                  <Map className="h-4 w-4" />
                  {showJourneyInfo ? "Hide Journey Info" : "Show Journey Info"}
                </Button>
              )}
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
          </div>
          
          {/* Journey information section */}
          {journey && showJourneyInfo && (
            <JourneyInfo journey={journey} />
          )}
          
          {/* Campgrounds section */}
          {showCampgrounds && (
            <CampgroundSection 
              location={journey?.segments[0]?.geometry?.coordinates[0] ? 
                { 
                  lat: journey.segments[0].geometry.coordinates[0][1], 
                  lng: journey.segments[0].geometry.coordinates[0][0] 
                } : undefined}
            />
          )}

          {/* Day tabs and itinerary content */}
          <ItineraryDayTabs 
            itinerary={itinerary}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
          />
        </div>
      ) : (
        <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">No itinerary information available for this trip.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryTab;
