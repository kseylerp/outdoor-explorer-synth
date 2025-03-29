
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, CornerDownLeft } from 'lucide-react';
import { Trip } from '@/types/trips';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const Maps: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('driving');
  const isMobile = useIsMobile();

  // Load saved trips from localStorage
  useEffect(() => {
    const savedTripsData = localStorage.getItem('savedTrips');
    if (savedTripsData) {
      try {
        const parsedTrips = JSON.parse(savedTripsData);
        setSavedTrips(parsedTrips);
      } catch (error) {
        console.error('Error parsing saved trips:', error);
        toast({
          title: "Error",
          description: "Could not load your saved trips.",
          variant: "destructive"
        });
      }
    }
  }, []);

  const handleGetDirections = () => {
    if (!selectedTripId) {
      toast({
        title: "Select a Trip",
        description: "Please select a saved trip to get directions.",
        variant: "destructive"
      });
      return;
    }

    // Here we would integrate with the navigation system
    toast({
      title: "Starting Navigation",
      description: "Turn-by-turn directions are being prepared...",
    });
  };

  const selectedTrip = savedTrips.find(trip => trip.id === selectedTripId);

  return (
    <div className="container mx-auto py-4 px-4 max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Turn-by-Turn Navigation</h1>
        <p className="text-gray-600">Get directions to your saved adventures</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Adventure</label>
                <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a saved trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedTrips.map(trip => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transportation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={transportMode === 'driving' ? 'default' : 'outline'}
                    onClick={() => setTransportMode('driving')}
                    className={transportMode === 'driving' ? 'bg-purple-600' : ''}
                  >
                    Driving
                  </Button>
                  <Button 
                    variant={transportMode === 'walking' ? 'default' : 'outline'}
                    onClick={() => setTransportMode('walking')}
                    className={transportMode === 'walking' ? 'bg-purple-600' : ''}
                  >
                    Walking
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleGetDirections}
              >
                Get Directions
              </Button>
            </div>
          </Card>

          {selectedTrip && (
            <Card className="p-4">
              <h3 className="font-medium mb-2">Trip Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Location:</strong> {selectedTrip.location}</p>
                <p><strong>Duration:</strong> {selectedTrip.duration}</p>
                <p><strong>Difficulty:</strong> {selectedTrip.difficultyLevel}</p>
              </div>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-[500px] p-0 overflow-hidden">
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center p-6">
                <Navigation size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">Navigation Ready</h3>
                <p className="text-gray-600 mb-4">
                  Select a saved trip to begin turn-by-turn navigation
                </p>
                {isMobile && (
                  <p className="text-sm text-purple-600">
                    Uses native device navigation for optimal mobile experience
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CornerDownLeft className="text-purple-600" />
            <h2 className="text-xl font-semibold">Navigation Features</h2>
          </div>
          
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Turn-by-Turn Directions</h3>
                <p className="text-sm text-gray-600">Detailed navigation with voice guidance</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Offline Maps</h3>
                <p className="text-sm text-gray-600">Download routes for offline use</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Trail Information</h3>
                <p className="text-sm text-gray-600">Elevation profiles and difficulty ratings</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Mobile Optimized</h3>
                <p className="text-sm text-gray-600">Native device integration for better performance</p>
              </div>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Maps;
