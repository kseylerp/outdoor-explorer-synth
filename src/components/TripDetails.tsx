
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users } from 'lucide-react';
import { Trip } from '@/types/trips';
import BuddiesManager from './buddies/BuddiesManager';

// Import our new components
import TripHeader from './trip-details/TripHeader';
import PriceBreakdown from './trip-details/PriceBreakdown';
import TripIntensityCard from './trip-details/TripIntensityCard';
import TripDescription from './trip-details/TripDescription';
import TripMapSection from './trip-details/TripMapSection';
import ItineraryTab from './trip-details/ItineraryTab';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'buddies'>('itinerary');
  
  return (
    <Card className="w-full">
      <TripHeader trip={trip} />
      
      <CardContent>
        {/* Price and intensity section above the map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PriceBreakdown totalPrice={trip.priceEstimate} />
          <TripIntensityCard difficultyLevel={trip.difficultyLevel} />
        </div>
        
        <TripDescription 
          description={trip.description}
          whyWeChoseThis={trip.whyWeChoseThis}
          suggestedGuides={trip.suggestedGuides}
        />
        
        <TripMapSection trip={trip} />
        
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
            <ItineraryTab itinerary={trip.itinerary} />
          </TabsContent>
          
          <TabsContent value="buddies">
            <BuddiesManager tripId={trip.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TripDetails;
