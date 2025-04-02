
import React, { useState, useEffect } from 'react';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';
import NativeNavigation from '@/plugins/NativeNavigationPlugin';
import { Capacitor } from '@capacitor/core';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Import component files
import TripSelector from '@/components/maps/TripSelector';
import NavigationOptions from '@/components/maps/NavigationOptions';
import TripDetails from '@/components/maps/TripDetails';
import MapDisplay from '@/components/map/MapDisplay';
import MapFeatures from '@/components/maps/MapFeatures';
import NavigationControls from '@/components/maps/NavigationControls';
import RouteTypeSelector from '@/components/maps/RouteTypeSelector';
import NavigationMap from '@/components/maps/NavigationMap';

const Maps: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('driving');
  const [isNativeAvailable, setIsNativeAvailable] = useState<boolean>(false);
  const [controlsOpen, setControlsOpen] = useState<boolean>(true); // Default to open
  const [routeType, setRouteType] = useState<string>('all');
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);
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
    const loadSavedTrips = async () => {
      setIsLoadingTrips(true);
      try {
        const savedTripsData = localStorage.getItem('savedTrips');
        if (savedTripsData) {
          const parsedTrips = JSON.parse(savedTripsData);
          setSavedTrips(parsedTrips);
          
          // Auto-select the first trip if available and none is selected
          if (parsedTrips.length > 0 && !selectedTripId) {
            setSelectedTripId(parsedTrips[0].id);
          }
        }
      } catch (error) {
        console.error('Error parsing saved trips:', error);
        toast({
          title: "Error",
          description: "Could not load your saved trips.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingTrips(false);
      }
    };
    
    loadSavedTrips();
  }, []);

  const selectedTrip = savedTrips.find(trip => trip.id === selectedTripId);

  // Toggle controls panel
  const toggleControls = () => {
    setControlsOpen(!controlsOpen);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Map takes full screen */}
      <div className="w-full h-full flex-1 relative">
        {selectedTrip ? (
          <MapDisplay 
            journey={selectedTrip.journey} 
            markers={selectedTrip.markers} 
            center={selectedTrip.mapCenter}
            interactive={true}
            routeType={routeType}
          />
        ) : (
          <NavigationMap isNativeAvailable={isNativeAvailable} />
        )}
        
        {/* Floating dropdown controls panel */}
        <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ${isMobile ? 'w-5/6' : 'w-96'}`}>
          <div 
            className="bg-white rounded-lg shadow-lg p-4 cursor-pointer flex justify-between items-center"
            onClick={toggleControls}
          >
            <span className="font-medium">Navigation Controls</span>
            {controlsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {controlsOpen && (
            <div className="bg-white rounded-lg shadow-lg mt-2 p-4 space-y-4">
              <TripSelector 
                savedTrips={savedTrips}
                selectedTripId={selectedTripId}
                setSelectedTripId={setSelectedTripId}
                isLoading={isLoadingTrips}
              />
              
              {selectedTrip && (
                <>
                  <RouteTypeSelector 
                    routeType={routeType}
                    setRouteType={setRouteType}
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
                  
                  <TripDetails trip={selectedTrip} />
                </>
              )}
              
              <MapFeatures />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maps;
