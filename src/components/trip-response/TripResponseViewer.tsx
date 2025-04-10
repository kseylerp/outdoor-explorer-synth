
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/types/trips';
import { MapPin, Calendar, Clock, Flag, Info, CheckCircle } from 'lucide-react';
import MapDisplay from '@/components/map/MapDisplay';
import TripItinerary from '@/components/trip-card/TripItinerary';

interface TripResponseViewerProps {
  tripData: Trip;
  rawResponse?: string;
  thinking?: string[];
}

const TripResponseViewer: React.FC<TripResponseViewerProps> = ({ 
  tripData, 
  rawResponse,
  thinking
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!tripData) {
    return (
      <Card className="w-full p-6">
        <CardContent className="pt-6 text-center text-gray-500">
          No trip data available to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-800 to-purple-600 text-white">
        <CardTitle className="text-2xl font-bold">{tripData.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {tripData.location}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {tripData.duration}
          </Badge>
          <Badge 
            className={`flex items-center gap-1 ${
              tripData.difficultyLevel === 'Easy' ? 'bg-green-600' :
              tripData.difficultyLevel === 'Moderate' ? 'bg-yellow-600' :
              tripData.difficultyLevel === 'Challenging' ? 'bg-orange-600' :
              'bg-red-600'
            } text-white`}
          >
            {tripData.difficultyLevel}
          </Badge>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="overview" className="p-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-600" />
              Trip Description
            </h3>
            <p className="text-gray-700">{tripData.description}</p>
          </div>
          
          {/* Why We Chose This */}
          <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
            <h3 className="text-lg font-semibold mb-2">Why We Chose This</h3>
            <p className="text-gray-700">{tripData.whyWeChoseThis}</p>
          </div>
          
          {/* Price Estimate */}
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" /> 
              Price Estimate
            </h3>
            <p className="text-gray-700">${tripData.priceEstimate}</p>
          </div>
          
          {/* Best Time to Visit */}
          {tripData.bestTimeToVisit && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="text-lg font-semibold mb-2">Best Time to Visit</h3>
              <p className="text-gray-700">{tripData.bestTimeToVisit}</p>
            </div>
          )}
          
          {/* Highlights */}
          {tripData.highlights && tripData.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Flag className="h-4 w-4 text-amber-600" />
                Highlights
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {tripData.highlights.map((highlight, index) => (
                  <li key={index} className="text-gray-700">{highlight}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="itinerary">
          {tripData.itinerary && tripData.itinerary.length > 0 ? (
            <TripItinerary itinerary={tripData.itinerary} />
          ) : (
            <div className="text-center p-6 text-gray-500">
              No itinerary information available
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map" className="min-h-[400px]">
          {tripData.mapCenter && (
            <div className="h-[400px]">
              <MapDisplay 
                center={tripData.mapCenter}
                markers={tripData.markers}
                journey={tripData.journey}
                zoomLevel={10}
                interactive={true}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Thinking Steps (if provided) */}
      {thinking && thinking.length > 0 && (
        <div className="p-6 pt-0">
          <details className="text-sm">
            <summary className="text-purple-600 cursor-pointer font-medium">
              View AI Thinking Steps
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-700 max-h-60 overflow-auto">
              {thinking.map((step, index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </Card>
  );
};

export default TripResponseViewer;
