
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { generateTrips } from '@/services/trip/tripService';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import RealtimeChat from '@/components/RealtimeChat';

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleSubmitPrompt = async (inputPrompt: string) => {
    setPrompt(inputPrompt);
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    setThinking([]);
    setTrips([]);

    try {
      console.info(`Submitting prompt to generate trips: ${inputPrompt}`);
      const result = await generateTrips(inputPrompt, (thinkingSteps) => {
        setThinking(thinkingSteps);
      });
      
      // Log entire trip data to help debug
      console.info(`Received ${result.length} trips from API`);
      if (result.length > 0) {
        console.info('First trip details:', result[0]);
        if (result[0].itinerary) {
          console.log('First trip itinerary:', result[0].itinerary);
        }
      }
      
      setTrips(result);
    } catch (err) {
      console.error('Error processing prompt:', err);
      
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      
      // Split error message if it contains details
      if (errorMessage.includes("|")) {
        const [mainError, details] = errorMessage.split("|", 2);
        setError(mainError.trim());
        setErrorDetails(details.trim());
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (prompt) {
      handleSubmitPrompt(prompt);
    }
  };

  const handleSaveTrip = (trip: Trip) => {
    try {
      // Get existing saved trips or initialize empty array
      const savedTripsJson = localStorage.getItem('savedTrips') || '[]';
      const savedTrips = JSON.parse(savedTripsJson);
      
      // Check if already saved
      if (savedTrips.some((saved: Trip) => saved.id === trip.id)) {
        toast({
          title: "Already saved",
          description: "This trip is already in your saved collection",
        });
        return;
      }
      
      // Add to saved trips
      savedTrips.push(trip);
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      
      toast({
        title: "Trip saved!",
        description: "This adventure has been added to your saved trips",
      });
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: "Error saving trip",
        description: "Could not save this adventure. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let's find an <span className="offbeat-gradient">offbeat</span> adventure
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powered by local guides: explore, plan, and experience better trips
        </p>
      </div>

      {/* AI Assistant Banner */}
      {!showChat && (
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Meet Your Adventure Assistant</h2>
              <p className="text-gray-700">
                Chat with our AI-powered adventure assistant to get personalized travel recommendations and trip planning help.
              </p>
            </div>
            <Button 
              onClick={() => setShowChat(true)} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </div>
        </div>
      )}

      {/* Realtime Chat */}
      {showChat && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Adventure Assistant</h2>
            <Button variant="outline" onClick={() => setShowChat(false)}>
              Close Chat
            </Button>
          </div>
          <RealtimeChat />
        </div>
      )}

      <Card className="mb-8">
        <CardContent className="pt-6">
          <PromptInput onSubmit={handleSubmitPrompt} isProcessing={loading} />
        </CardContent>
      </Card>

      {error && (
        <ApiConnectionError 
          customMessage={error}
          errorDetails={errorDetails || undefined}
          onRetry={handleRetry}
        />
      )}

      {loading && (
        <div className="mb-8">
          <LoadingSpinner />
          {thinking.length > 0 && <ThinkingDisplay thinkingSteps={thinking} isVisible={true} />}
        </div>
      )}

      {trips.length > 0 && (
        <div className="space-y-8">
          {trips.map((trip, index) => (
            <div key={trip.id || `trip-${index}`} className="relative">
              {trips.length > 1 && (
                <div className="absolute -top-4 -left-2 z-10">
                  <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Option {index + 1}
                  </span>
                </div>
              )}
              <TripCard 
                key={index} 
                trip={trip}
                onSave={() => handleSaveTrip(trip)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
