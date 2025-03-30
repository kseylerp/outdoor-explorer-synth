import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/trip-card';
import { Trip } from '@/types/trips';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { generateTrips } from '@/services/tripService';
const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
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
    setErrorDetails(null);
    setTrips([]); // Clear any previous trips

    try {
      console.log('Submitting prompt to generate trips:', prompt);
      const tripsData = await generateTrips(prompt);
      if (!tripsData || tripsData.length === 0) {
        throw new Error('No trip recommendations received');
      }
      console.log('Received trips data:', tripsData);

      // Set the trips from the API response
      setTrips(tripsData);
      toast({
        title: "Adventures Found!",
        description: "We've found some perfect adventures for you."
      });
    } catch (error) {
      console.error('Error processing prompt:', error);

      // Detailed error for debugging
      if (error instanceof Error) {
        setErrorDetails(error.message);
      } else {
        setErrorDetails('Unknown error occurred');
      }
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
        description: "The adventure has been removed from your saved trips."
      });
    } else {
      // Add the trip if it's not saved
      const updatedTrips = [...savedTrips, trip];
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      setSavedTripIds([...savedTripIds, trip.id]);
      toast({
        title: "Trip Saved!",
        description: "The adventure has been saved to your collection."
      });
    }
  };
  return <div className="container max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="font-poppins px-5 font-bold text-5xl letter-spacing: -10px">
          <span className="offbeat-gradient mx-">offbeat</span> adventure
        </h1>
        <p className="font-patano text-lg font-medium">off-the-beaten path trips, powered by local guides</p>
      </div>
      
      <Card className="p-6 shadow-md">
        <PromptInput onSubmit={handleSubmitPrompt} isProcessing={isProcessing} />
        
        {errorDetails && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            <p className="font-semibold">Error details (for debugging):</p>
            <p className="font-mono text-xs mt-1">{errorDetails}</p>
          </div>}
      </Card>
      
      {trips.length > 0 && <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recommended Adventures</h2>
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip, index) => <div key={trip.id} className="relative">
                <div className="absolute -top-2 left-4 z-10">
                  <span className="bg-[#9870FF] text-white px-3 py-1 text-sm font-medium rounded-full">
                    Option {index + 1}
                  </span>
                </div>
                <TripCard trip={trip} onExpand={() => handleViewTripDetails(trip.id)} isSaved={savedTripIds.includes(trip.id)} onSave={() => handleSaveTrip(trip)} />
              </div>)}
          </div>
        </div>}
    </div>;
};
export default Index;