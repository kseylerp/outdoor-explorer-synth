
import React, { useState } from 'react';
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
  const navigate = useNavigate();

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

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-gradient font-extrabold text-4xl tracking-tight">
          How can Yugen Help You
        </h1>
        <h2 className="text-xl text-gray-700">
          Discover, Plan, and Share Your Next Adventure
        </h2>
      </div>
      
      <Card className="p-6 shadow-md">
        <PromptInput onSubmit={handleSubmitPrompt} isProcessing={isProcessing} />
      </Card>
      
      {trips.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recommended Adventures</h2>
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onExpand={() => handleViewTripDetails(trip.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
