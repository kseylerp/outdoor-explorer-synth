
import React from 'react';
import { Button } from '@/components/ui/button';
import { Capacitor } from '@capacitor/core';
import { toast } from '@/hooks/use-toast';
import NativeNavigation from '@/plugins/NativeNavigationPlugin';
import { Trip } from '@/types/trips';

interface NavigationControlsProps {
  selectedTripId: string;
  savedTrips: Trip[];
  transportMode: string;
  isNativeAvailable: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  selectedTripId,
  savedTrips,
  transportMode,
  isNativeAvailable
}) => {
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

  return (
    <div>
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
  );
};

export default NavigationControls;
