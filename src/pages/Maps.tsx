
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, CornerDownLeft } from 'lucide-react';

const Maps: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Turn-by-Turn Directions</h1>
      <p className="text-lg text-gray-700 mb-8">
        Get detailed navigation instructions for your outdoor adventures.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Route Planner</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="start" className="block text-sm font-medium mb-1">Starting Point</label>
                <div className="flex">
                  <Input id="start" placeholder="Enter starting location" />
                  <Button variant="ghost" size="icon" className="ml-1">
                    <MapPin size={18} />
                  </Button>
                </div>
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">Destination</label>
                <div className="flex">
                  <Input id="destination" placeholder="Enter destination" />
                  <Button variant="ghost" size="icon" className="ml-1">
                    <MapPin size={18} />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Route Type</label>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-purple-50">Hiking</Button>
                  <Button variant="outline" className="flex-1">Driving</Button>
                  <Button variant="outline" className="flex-1">Biking</Button>
                </div>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Get Directions
              </Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-medium mb-2">Route Options</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="avoidHighways" className="mr-2" />
                <label htmlFor="avoidHighways" className="text-sm">Avoid highways</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="avoidTolls" className="mr-2" />
                <label htmlFor="avoidTolls" className="text-sm">Avoid tolls</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="preferScenic" className="mr-2" checked />
                <label htmlFor="preferScenic" className="text-sm">Prefer scenic routes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="trailsOnly" className="mr-2" checked />
                <label htmlFor="trailsOnly" className="text-sm">Trails only (hiking)</label>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full p-0 overflow-hidden">
            <div className="h-[500px] bg-gray-100 flex items-center justify-center">
              <div className="text-center p-6">
                <Navigation size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">Map Viewer</h3>
                <p className="text-gray-600 mb-4">Enter a route to see turn-by-turn directions and trail information</p>
                <p className="text-sm text-gray-500">
                  Our mobile app provides enhanced navigation with offline maps and GPS tracking.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6 p-4">
        <div className="flex items-center mb-4">
          <CornerDownLeft className="mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold">Turn-by-Turn Directions</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Enter a route above to see detailed step-by-step directions. Our trail directions include:
        </p>
        
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Detailed trail maps with elevation profiles</li>
          <li>Trail conditions and difficulty ratings</li>
          <li>Points of interest and rest areas</li>
          <li>Water sources and campsite locations</li>
          <li>Mobile-friendly directions that work offline</li>
        </ul>
        
        <div className="mt-6 p-4 bg-purple-50 rounded-md">
          <h3 className="font-medium mb-2">Mobile App Integration</h3>
          <p className="text-sm text-gray-700">
            For the best outdoor navigation experience, download our mobile app with native iOS and Android support. 
            Get enhanced GPS tracking, offline maps, and voice-guided directions specifically designed for outdoor adventures.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Maps;
