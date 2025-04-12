
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users } from 'lucide-react';
import { Trip } from '@/types/trips';
import BuddiesManager from './buddies/BuddiesManager';
import TripBaseView from './trip-shared/TripBaseView';
import ItineraryTab from './trip-details/ItineraryTab';
import TripIntensityCard from './trip-details/TripIntensityCard';
import { toast } from '@/hooks/use-toast';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'buddies'>('itinerary');
  const [isSaved, setIsSaved] = useState(false);
  
  // Add console log to check the trip data structure
  console.log('Trip details:', trip);
  console.log('Trip itinerary:', trip.itinerary);
  console.log('Trip journey:', trip.journey);

  const handleSaveTrip = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Trip removed from saved trips" : "Trip saved successfully",
      description: isSaved ? 
        "The trip has been removed from your saved trips." : 
        "You can find this trip in your saved trips section.",
    });
  };
  
  return (
    <Card className="w-full">
      <TripBaseView 
        trip={trip} 
        isSaved={isSaved}
        onSave={handleSaveTrip}
      >
        <div className="space-y-6">
          <Tabs defaultValue="itinerary" onValueChange={(value) => setActiveTab(value as 'itinerary' | 'buddies')}>
            <TabsList className="mb-4 bg-purple-100 dark:bg-purple-900/30">
              <TabsTrigger 
                value="itinerary"
                className="data-[state=active]:bg-[#65558F] data-[state=active]:text-white"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger 
                value="buddies"
                className="data-[state=active]:bg-[#65558F] data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-1" />
                Trip Buddies
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary">
              <ItineraryTab itinerary={trip.itinerary} journey={trip.journey} />
            </TabsContent>
            
            <TabsContent value="buddies">
              <BuddiesManager tripId={trip.id} />
            </TabsContent>
          </Tabs>
        </div>
      </TripBaseView>
    </Card>
  );
};

export default TripDetails;
