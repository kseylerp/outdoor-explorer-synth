
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, ArrowRight, Info } from 'lucide-react';
import MapDisplay from './MapDisplay';
import { Activity, ItineraryDay, Trip } from '@/types/trips';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{trip.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <MapPin className="h-3 w-3" /> {trip.location}
          </Badge>
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <Clock className="h-3 w-3" /> {trip.duration}
          </Badge>
          <Badge className="bg-blue-500 text-white">{trip.difficultyLevel}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose max-w-none mb-6">
          <h3 className="text-lg font-semibold">About This Trip</h3>
          <p>{trip.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-md my-4">
            <h4 className="text-md font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Why We Chose This
            </h4>
            <p className="text-sm">{trip.whyWeChoseThis}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold">Price Estimate</h4>
            <p className="text-sm">{trip.priceEstimate}</p>
          </div>
          
          {trip.suggestedGuides && trip.suggestedGuides.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold">Suggested Guides</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {trip.suggestedGuides.map((guide, idx) => (
                  <Badge key={idx} variant="outline">
                    {guide}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Interactive Map</h3>
          <div className="h-[400px] w-full">
            <MapDisplay 
              center={trip.mapCenter}
              markers={trip.markers}
              journey={trip.journey}
              interactive={true}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Day-by-Day Itinerary</h3>
          
          <Tabs defaultValue={selectedDay.toString()} onValueChange={(val) => setSelectedDay(parseInt(val))}>
            <TabsList className="mb-4">
              {trip.itinerary.map((day) => (
                <TabsTrigger key={day.day} value={day.day.toString()}>
                  Day {day.day}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {trip.itinerary.map((day) => (
              <TabsContent key={day.day} value={day.day.toString()}>
                <DayDetails day={day} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

interface DayDetailsProps {
  day: ItineraryDay;
}

const DayDetails: React.FC<DayDetailsProps> = ({ day }) => {
  return (
    <div>
      <h4 className="text-xl font-semibold mb-2">{day.title}</h4>
      <p className="mb-4 text-gray-600">{day.description}</p>
      
      <div className="space-y-4">
        {day.activities.map((activity, idx) => (
          <ActivityCard 
            key={idx} 
            activity={activity} 
            isLast={idx === day.activities.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};

interface ActivityCardProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isLast }) => {
  return (
    <div className="relative">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-semibold">{activity.name}</h5>
            <Badge variant="outline">{activity.duration}</Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{activity.type}</Badge>
            {activity.permitRequired && (
              <Badge variant="outline" className="bg-amber-100">
                Permit Required
              </Badge>
            )}
          </div>
          
          {activity.permitDetails && (
            <div className="mb-2 text-sm">
              <span className="font-medium">Permit Details: </span>
              <span className="text-gray-600">{activity.permitDetails}</span>
            </div>
          )}
          
          {activity.outfitters && activity.outfitters.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Suggested Outfitters: </span>
              <span className="text-gray-600">{activity.outfitters.join(', ')}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {!isLast && (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto my-2">
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default TripDetails;
