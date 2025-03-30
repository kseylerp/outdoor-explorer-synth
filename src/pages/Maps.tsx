
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';
import NativeNavigation from '@/plugins/NativeNavigationPlugin';
import { Capacitor } from '@capacitor/core';

// Import new component files
import TripSelector from '@/components/maps/TripSelector';
import NavigationOptions from '@/components/maps/NavigationOptions';
import TripDetails from '@/components/maps/TripDetails';
import NavigationMap from '@/components/maps/NavigationMap';
import MapFeatures from '@/components/maps/MapFeatures';
import NavigationControls from '@/components/maps/NavigationControls';

const Maps: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('driving');
  const [isNativeAvailable, setIsNativeAvailable] = useState<boolean>(false);

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
              <TripSelector 
                savedTrips={savedTrips}
                selectedTripId={selectedTripId}
                setSelectedTripId={setSelectedTripId}
              />

              <NavigationOptions 
                transportMode={transportMode}
                setTransportMode={setTransportMode}
              />

              <NavigationControls 
                selectedTripId={selectedTripId}
                savedTrips={savedTrips}
                transportMode={transportMode}
                isNativeAvailable={isNativeAvailable}
              />
            </div>
          </Card>

          <TripDetails trip={selectedTrip} />
        </div>
        
        <div className="md:col-span-2">
          <NavigationMap isNativeAvailable={isNativeAvailable} />
        </div>
      </div>

      <MapFeatures />
    </div>
  );
};

export default Maps;
