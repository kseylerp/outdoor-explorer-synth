
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

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

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
            <TripCard key={index} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
