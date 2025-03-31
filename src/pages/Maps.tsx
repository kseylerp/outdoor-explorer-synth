
import React, { useState, useEffect } from 'react';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';
import NativeNavigation from '@/plugins/NativeNavigationPlugin';
import { Capacitor } from '@capacitor/core';
import { useIsMobile } from '@/hooks/use-mobile';

// Import component files
import TripSelector from '@/components/maps/TripSelector';
import NavigationOptions from '@/components/maps/NavigationOptions';
import TripDetails from '@/components/maps/TripDetails';
import MapDisplay from '@/components/map/MapDisplay';
import NavigationControls from '@/components/maps/NavigationControls';
import RouteTypeSelector from '@/components/maps/RouteTypeSelector';

const Maps: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('driving');
  const [isNativeAvailable, setIsNativeAvailable] = useState<boolean>(false);
  const [routeType, setRouteType] = useState<string>('all');
  const isMobile = useIsMobile();

  // Check if native navigation is available
  useEffect(() => {
    const checkNativeNavigation = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { available } = await NativeNavigation.isNavigationAvailable();
          setIsNativeAvailable(available);
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
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Map takes full screen */}
      <div className="w-full h-full flex-1 relative">
        <MapDisplay 
          journey={selectedTrip?.journey} 
          markers={selectedTrip?.markers} 
          interactive={true}
          routeType="all" // Always show all route types
        />
        
        {/* Simple control panel for trip selection */}
        <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ${isMobile ? 'w-5/6' : 'w-96'}`}>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="space-y-4">
              <TripSelector 
                savedTrips={savedTrips}
                selectedTripId={selectedTripId}
                setSelectedTripId={setSelectedTripId}
              />
              
              {selectedTrip && (
                <>
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
                  
                  <TripDetails trip={selectedTrip} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
