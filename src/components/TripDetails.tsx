
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Info, Calendar, DollarSign, Flag, Users } from 'lucide-react';
import MapDisplay from './MapDisplay';
import { Activity, ItineraryDay, Trip } from '@/types/trips';
import BuddiesManager from './buddies/BuddiesManager';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [routeType, setRouteType] = useState('all');
  const [activeTab, setActiveTab] = useState<'itinerary' | 'buddies'>('itinerary');
  
  // Format price as a string with dollar sign
  const formatPrice = (price: number): string => {
    if (price <= 0) return 'Price not available';
    return `$${price.toLocaleString()}`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{trip.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <MapPin className="h-3 w-3" /> {trip.location || 'Location not specified'}
          </Badge>
          <Badge variant="outline" className="flex gap-1 items-center text-sm">
            <Clock className="h-3 w-3" /> {trip.duration || 'Duration not specified'}
          </Badge>
          <Badge className="bg-purple-600 text-white">{trip.difficultyLevel || 'Difficulty unknown'}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose max-w-none mb-6">
          <h3 className="text-lg font-semibold">About This Trip</h3>
          <p>{trip.description || 'No description available'}</p>
          
          <div className="bg-purple-50 p-4 rounded-md my-4 border-l-4 border-purple-300">
            <h4 className="text-md font-semibold flex items-center gap-2 text-purple-800">
              <Info className="h-4 w-4 text-purple-600" />
              Why We Chose This
            </h4>
            <p className="text-sm">{trip.whyWeChoseThis || 'No information available'}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Price Estimate
            </h4>
            <p className="text-xl font-semibold mt-1">{formatPrice(trip.priceEstimate)}</p>
            <p className="text-sm text-gray-500">Estimated total per person</p>
          </div>
          
          {trip.suggestedGuides && trip.suggestedGuides.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold">Suggested Guides</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {trip.suggestedGuides.map((guide, idx) => (
                  <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700">
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
              routeType={routeType}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Click on the map to enable interaction. Click routes or markers for detailed information.</p>
        </div>
        
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
            {trip.itinerary && trip.itinerary.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Day-by-Day Itinerary</h3>
                
                <Tabs defaultValue={selectedDay.toString()} onValueChange={(val) => setSelectedDay(parseInt(val))}>
                  <TabsList className="mb-4 bg-purple-100">
                    {trip.itinerary.map((day) => (
                      <TabsTrigger 
                        key={day.day} 
                        value={day.day.toString()}
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
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
            ) : (
              <div className="text-center p-4 border border-gray-200 rounded-md">
                <p className="text-gray-500">No itinerary information available for this trip.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="buddies">
            <BuddiesManager tripId={trip.id} />
          </TabsContent>
        </Tabs>
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
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-800">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-1 text-purple-800">{day.title || `Day ${day.day}`}</h4>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Clock className="h-3 w-3 mr-1" /> Full day
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 pl-[52px]">
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-500">Notes</h5>
          <p className="text-gray-700">{day.description || 'No description available'}</p>
        </div>
        
        <h4 className="text-lg font-medium mb-4">Activities</h4>
        
        {day.activities && day.activities.length > 0 ? (
          <div className="space-y-4">
            {day.activities.map((activity, idx) => (
              <ActivityCard 
                key={idx} 
                activity={activity} 
                isLast={idx === day.activities.length - 1} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center p-4">No activities available for this day.</p>
        )}
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-purple-600" />
            <h3 className="text-lg font-medium">Adventure Level</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-1/3 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600">Light</span>
          </div>
          <p className="text-sm text-gray-500">Activity intensity level</p>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-600" />
            <h3 className="text-lg font-medium">Price Information</h3>
          </div>
          <p className="text-xl font-semibold">$2500 - $3500</p>
          <p className="text-sm text-gray-500">Estimated total per person</p>
        </div>
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
      <Card className="border-l-4 border-l-purple-400 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-semibold text-purple-700">{activity.name || 'Unnamed Activity'}</h5>
            <Badge variant="outline" className="bg-purple-50">{activity.duration || 'Duration unknown'}</Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{activity.description || 'No description available'}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{activity.type || 'Other'}</Badge>
            {activity.permitRequired && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
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
    </div>
  );
};

export default TripDetails;
