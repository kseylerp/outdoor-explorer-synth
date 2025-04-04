
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItineraryDay, Journey } from '@/types/trips';
import DayDetails from './DayDetails';
import { Button } from '@/components/ui/button';
import { Map, Tent } from 'lucide-react';
import CampgroundSearch from '../campground/CampgroundSearch';
import CampgroundDetails from '../campground/CampgroundDetails';
import { Campground } from '@/services/campground/campgroundService';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ItineraryTabProps {
  itinerary: ItineraryDay[];
  journey?: Journey;
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ itinerary, journey }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showCampgrounds, setShowCampgrounds] = useState(false);
  const [showJourneyInfo, setShowJourneyInfo] = useState(false);
  const [selectedCampground, setSelectedCampground] = useState<Campground | null>(null);
  const { toast } = useToast();

  // Add console logs to debug the data
  console.log('ItineraryTab - itinerary:', itinerary);
  console.log('ItineraryTab - journey:', journey);

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

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} meters`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${minutes} min`;
  };

  // Create a full set of days based on the trip duration
  // The assumption is that the day property in itinerary items reflects the actual day number
  const maxDays = itinerary && itinerary.length > 0 
    ? Math.max(...itinerary.map(day => day.day))
    : 1;

  return (
    <div>
      {itinerary && itinerary.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{maxDays}-Day Itinerary</h3>
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
          
          {journey && showJourneyInfo && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-md font-medium mb-3">Journey Overview</h4>
              <div className="space-y-3">
                <p><span className="font-medium">Total Distance:</span> {formatDistance(journey.totalDistance)}</p>
                <p><span className="font-medium">Total Duration:</span> {formatDuration(journey.totalDuration)}</p>
                {journey.segments.length > 0 && (
                  <div>
                    <h5 className="font-medium mt-3 mb-2">Segments:</h5>
                    <div className="space-y-2">
                      {journey.segments.map((segment, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-slate-100">
                          <p className="font-medium text-purple-700">{segment.from} → {segment.to}</p>
                          <p className="text-sm">
                            <span className="capitalize">{segment.mode}</span> • {formatDistance(segment.distance)} • {formatDuration(segment.duration)}
                          </p>
                          {segment.elevationGain && (
                            <p className="text-sm">Elevation Gain: {segment.elevationGain}m</p>
                          )}
                          {segment.terrain && (
                            <p className="text-sm">Terrain: {segment.terrain}</p>
                          )}
                          {segment.description && (
                            <p className="text-sm mt-1 text-gray-600">{segment.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {showCampgrounds && !selectedCampground && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-md font-medium mb-3">Find Campgrounds Near Your Trip</h4>
              <CampgroundSearch 
                location={journey?.segments[0]?.geometry?.coordinates[0] ? 
                  { 
                    lat: journey.segments[0].geometry.coordinates[0][1], 
                    lng: journey.segments[0].geometry.coordinates[0][0] 
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

          {itinerary.length < maxDays && (
            <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
              <AlertDescription>
                This trip is {maxDays} days long, but only {itinerary.length} days have detailed itineraries. 
                The remaining days show placeholder information.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue={selectedDay.toString()} onValueChange={(val) => setSelectedDay(parseInt(val))}>
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
