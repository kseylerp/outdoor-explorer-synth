import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/trip-card';
import { Trip } from '@/types/trips';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { generateTrips } from '@/services/trip/tripService';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ModelSelector from '@/components/ModelSelector';

const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [thinking, setThinking] = useState<string[] | undefined>(undefined);
  const [showThinking, setShowThinking] = useState(false);
  const [aiModel, setAiModel] = useState<'claude' | 'gemini'>(
    () => (localStorage.getItem('preferredAiModel') as 'claude' | 'gemini') || 'claude'
  );
  const navigate = useNavigate();

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
    setThinking(undefined);
    setTrips([]);

    try {
      console.log('Submitting prompt to generate trips:', prompt);
      const response = await generateTrips(prompt);
      
      if (!response.trips || response.trips.length === 0) {
        throw new Error('No trip recommendations received');
      }
      
      console.log('Received trips data:', response.trips);
      
      setTrips(response.trips);
      
      if (response.thinking && response.thinking.length > 0) {
        setThinking(response.thinking);
        setShowThinking(true);
      }
      
      toast({
        title: "Adventures Found!",
        description: "We've found some perfect adventures for you."
      });
    } catch (error) {
      console.error('Error processing prompt:', error);

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (errorMessage.includes("API key is not set") || errorMessage.includes("Edge Function Error")) {
        setErrorDetails(
          aiModel === 'gemini'
            ? "The Gemini API key is not properly configured. Please try switching to Claude model in Settings or contact support."
            : "The Claude API key is not properly configured. Please try switching to Gemini model in Settings or contact support."
        );
      } else {
        setErrorDetails(errorMessage);
      }
      
      toast({
        title: "Error",
        description: "Could not process your request. Please try again or switch AI models in Settings.",
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
    const savedTripsData = localStorage.getItem('savedTrips');
    let savedTrips: Trip[] = [];
    if (savedTripsData) {
      try {
        savedTrips = JSON.parse(savedTripsData);
      } catch (error) {
        console.error('Error parsing saved trips:', error);
      }
    }

    if (savedTripIds.includes(trip.id)) {
      const updatedTrips = savedTrips.filter(savedTrip => savedTrip.id !== trip.id);
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      setSavedTripIds(savedTripIds.filter(id => id !== trip.id));
      toast({
        title: "Trip Removed",
        description: "The adventure has been removed from your saved trips."
      });
    } else {
      const updatedTrips = [...savedTrips, trip];
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      setSavedTripIds([...savedTripIds, trip.id]);
      toast({
        title: "Trip Saved!",
        description: "The adventure has been saved to your collection."
      });
    }
  };

  const toggleThinking = () => {
    setShowThinking(prev => !prev);
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-8 pb-32">
      <div className="text-center space-y-2 mb-8">
        <h1 className="font-poppins px-5 font-bold text-4xl">Let's find an
          <span className="offbeat-gradient mx-"> offbeat</span> adventure
        </h1>
        <p className="font-patano text-lg font-medium">Powered by local guides: explore, plan, and experience better trips</p>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">AI Model:</span>
          <ModelSelector compact showLabels={false} onChange={(model) => setAiModel(model)} />
        </div>
      </div>
      
      {thinking && thinking.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={toggleThinking}
            className="text-sm text-purple-600 hover:text-purple-800 underline flex items-center"
          >
            {showThinking ? "Hide AI thinking process" : "Show AI thinking process"}
          </button>
        </div>
      )}
      
      <ThinkingDisplay thinkingSteps={thinking} isVisible={showThinking} />
      
      {trips.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recommended Adventures</h2>
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip, index) => (
              <div key={trip.id} className="relative">
                <div className="absolute -top-2 left-4 z-10">
                  <span className="bg-[#9870FF] text-white px-3 py-1 text-sm font-medium rounded-full">
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
      
      {errorDetails && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          <p className="font-semibold mb-2">Error:</p>
          <p>{errorDetails}</p>
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm">Try switching models:</span>
            <ModelSelector showLabels={true} onChange={(model) => setAiModel(model)} />
          </div>
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="container mx-auto max-w-5xl">
          <PromptInput 
            onSubmit={handleSubmitPrompt} 
            isProcessing={isProcessing} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
