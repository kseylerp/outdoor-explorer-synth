
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import { Trip } from '@/types/trips';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Import the mockTrips from tripService
import { mockTrips } from '@/services/tripService';

const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load saved trip IDs from localStorage
  useEffect(() => {
    const savedTripsData = localStorage.getItem('savedTrips');
    if (savedTripsData) {
      try {
        const parsedTrips = JSON.parse(savedTripsData);
        setSavedTripIds(parsedTrips.map((trip: Trip) => trip.id));
      } catch (error) {
        console.error('Error parsing saved trips:', error);
      }
    }
  }, []);

  const handleSubmitPrompt = async (prompt: string) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call an API to process the prompt
      // For demo purposes, we'll just simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTrips(mockTrips.slice(0, 2));
      
      toast({
        title: "Adventures Found!",
        description: "We've found some perfect adventures for you.",
      });
    } catch (error) {
      console.error('Error processing prompt:', error);
      toast({
        title: "Error",
        description: "Could not process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewTripDetails = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const handleSaveTrip = (trip: Trip) => {
    // Get existing saved trips
    const savedTripsData = localStorage.getItem('savedTrips');
    let savedTrips: Trip[] = [];
    
    if (savedTripsData) {
      try {
        savedTrips = JSON.parse(savedTripsData);
      } catch (error) {
        console.error('Error parsing saved trips:', error);
      }
    }
    
    // Check if trip is already saved
    if (savedTripIds.includes(trip.id)) {
      // Remove the trip if it's already saved
      const updatedTrips = savedTrips.filter(savedTrip => savedTrip.id !== trip.id);
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      setSavedTripIds(savedTripIds.filter(id => id !== trip.id));
      
      toast({
        title: "Trip Removed",
        description: "The adventure has been removed from your saved trips.",
      });
    } else {
      // Add the trip if it's not saved
      const updatedTrips = [...savedTrips, trip];
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      setSavedTripIds([...savedTripIds, trip.id]);
      
      toast({
        title: "Trip Saved!",
        description: "The adventure has been saved to your collection.",
      });
    }
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2 mb-10">
        <h1 className="font-poppins">
          <span className="text-[#303030] text-[40px] font-normal tracking-[-1.5px] leading-[60px]">How can </span>
          <span className="bg-gradient-to-r from-[#9870FF] via-[#98BBF7] to-[#9870FF] bg-clip-text text-transparent text-[40px] font-normal tracking-[-1.5px] leading-[60px]">Yugen</span>
          <span className="text-[#353535] text-[40px] font-normal tracking-[-1.5px] leading-[60px]"> help you</span>
          <br />
          <span className="text-black text-[24px] font-light tracking-[-1px] leading-[30px]">discover, plan, and share your next adventure?</span>
        </h1>
      </div>
      
      <Card className="p-6 shadow-md">
        <PromptInput onSubmit={handleSubmitPrompt} isProcessing={isProcessing} />
      </Card>
      
      {trips.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recommended Adventures</h2>
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip, index) => (
              <div key={trip.id} className="relative">
                <div className="absolute -top-2 left-4 z-10">
                  <span className="bg-purple-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Option {index + 1}
                  </span>
                </div>
                <TripCard 
                  trip={trip} 
                  onExpand={() => handleViewTripDetails(trip.id)}
                  isSaved={savedTripIds.includes(trip.id)}
                  onSave={() => handleSaveTrip(trip)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
