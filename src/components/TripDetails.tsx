
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users } from 'lucide-react';
import { Trip } from '@/types/trips';
import BuddiesManager from './buddies/BuddiesManager';
import TripBaseView from './trip-shared/TripBaseView';
import ItineraryTab from './trip-details/ItineraryTab';
import TripIntensityCard from './trip-details/TripIntensityCard';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'buddies'>('itinerary');
  
  return (
    <Card className="w-full">
      <TripBaseView trip={trip} compact={false}>
        <TripIntensityCard difficultyLevel={trip.difficultyLevel} />
        
        <Tabs defaultValue="itinerary" onValueChange={(value) => setActiveTab(value as 'itinerary' | 'buddies')}>
          <TabsList className="mb-4 bg-purple-100">
            <TabsTrigger 
              value="itinerary"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Itinerary
            </TabsTrigger>
            <TabsTrigger 
              value="buddies"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
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
      </TripBaseView>
    </Card>
  );
};

export default TripDetails;
