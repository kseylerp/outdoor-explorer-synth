
import React, { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { useTrips } from '@/hooks/useTrips';

const Index = () => {
  const {
    trips,
    loading,
    error,
    errorDetails,
    thinking,
    handlePromptSubmit,
    handleVoiceTripData,
    handleRetry,
    handleSaveTrip
  } = useTrips();
  
  const [dialogQuestion, setDialogQuestion] = useState<string | null>(null);
  
  // Handle voice transcript and potential trip data
  const handleTranscript = (transcript: string, tripData?: any) => {
    console.log('Index received transcript:', transcript);
    console.log('Index received trip data:', tripData);
    
    if (tripData) {
      handleVoiceTripData(tripData, transcript);
    } else {
      handlePromptSubmit(transcript);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl bg-white dark:bg-[#202020]">
      <div className="mb-8 text-center my-[20px] mx-0">
        <h1 className="text-4xl font-bold mb-4 py-0 mx-[2px] md:text-5xl my-px">
          Let's find an <span className="offbeat-gradient">offbeat</span> adventure
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-200 text-base my-0">
          Powered by local guides: explore, plan, and experience better trips
        </p>
      </div>

      <div className="mb-8 w-full bg-white dark:bg-[#202020]">
        <PromptInput 
          onSubmit={handlePromptSubmit} 
          onTranscript={handleTranscript}
          isProcessing={loading} 
          placeholder="Tell us about your dream trip..." 
        />
      </div>

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
          {thinking && thinking.length > 0 && (
            <ThinkingDisplay thinkingSteps={thinking} isVisible={true} />
          )}
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
              <TripCard trip={trip} onSave={() => handleSaveTrip(trip)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
