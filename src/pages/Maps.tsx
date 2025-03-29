
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, CornerDownLeft, MapIcon } from 'lucide-react';
import { Trip } from '@/types/trips';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import NativeNavigation from '@/plugins/NativeNavigationPlugin';
import { Capacitor } from '@capacitor/core';

const Maps: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('driving');
  const [isNativeAvailable, setIsNativeAvailable] = useState<boolean>(false);
  const isMobile = useIsMobile();

  // Check if native navigation is available
  useEffect(() => {
    const checkNativeNavigation = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { available } = await NativeNavigation.isNavigationAvailable();
          setIsNativeAvailable(available);
          console.log('Native navigation available:', available);
        } catch (error) {
          console.error('Error checking native navigation:', error);
          setIsNativeAvailable(false);
        }
      }
    };
    
    checkNativeNavigation();
  }, []);

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

  const handleGetDirections = async () => {
    if (!selectedTripId) {
      toast({
        title: "Select a Trip",
        description: "Please select a saved trip to get directions.",
        variant: "destructive"
      });
      return;
    }

    const selectedTrip = savedTrips.find(trip => trip.id === selectedTripId);
    
    if (!selectedTrip) {
      toast({
        title: "Error",
        description: "Could not find selected trip details.",
        variant: "destructive"
      });
      return;
    }

    try {
      // For demo purposes, we're using mock coordinates
      // In a real app, these would come from the trip data
      const startLat = 37.7749;  // San Francisco coordinates as example
      const startLng = -122.4194;
      
      // Parse destination coordinates from the trip location (simplified example)
      // In a real app, you'd have proper geocoding to get coordinates
      const endLat = 37.8199;  // Golden Gate coordinates as example
      const endLng = -122.4783;
      
      if (isNativeAvailable && Capacitor.isNativePlatform()) {
        // Use native navigation
        const result = await NativeNavigation.startNavigation({
          startLat,
          startLng,
          endLat,
          endLng,
          mode: transportMode,
          tripTitle: selectedTrip.title
        });
        
        if (result.success) {
          toast({
            title: "Navigation Started",
            description: "Turn-by-turn directions are active in native maps app"
          });
        } else {
          throw new Error(result.message);
        }
      } else {
        // Fallback to web maps
        const mode = transportMode === 'driving' ? 'driving' : 'walking';
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=${mode}`;
        window.open(url, '_blank');
        
        toast({
          title: "Web Navigation",
          description: "Directions opened in web maps"
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "Could not start navigation. Please try again.",
        variant: "destructive"
      });
    }
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
                {isNativeAvailable && Capacitor.isNativePlatform() 
                  ? "Start Native Navigation" 
                  : "Get Directions"}
              </Button>
              
              {Capacitor.isNativePlatform() && (
                <p className="text-xs text-gray-600 text-center">
                  {isNativeAvailable 
                    ? "Will use device's native maps app" 
                    : "Native navigation not available"}
                </p>
              )}
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
                    {Capacitor.isNativePlatform() && isNativeAvailable
                      ? "Will use native device navigation for optimal experience"
                      : "Uses web-based mapping for directions"}
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
