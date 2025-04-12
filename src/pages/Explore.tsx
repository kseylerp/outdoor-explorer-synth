
import React from 'react';
import PromptInput from '@/components/PromptInput';
import ExploreHeader from '@/components/explore/ExploreHeader';
import ErrorAlert from '@/components/explore/ErrorAlert';
import TripResults from '@/components/explore/TripResults';
import useTrips from '@/hooks/useTrips';

const Explore: React.FC = () => {
  const {
    trips,
    loading,
    error,
    errorDetails,
    thinking,
    showThinking,
    aiModel,
    handlePromptSubmit,
    handleVoiceTripData,
    handleRetry,
    handleSaveTrip
  } = useTrips();

  // Handle voice transcript and potential trip data
  const handleTranscript = (transcript: string, tripData?: any) => {
    if (tripData) {
      handleVoiceTripData(tripData, transcript);
    } else {
      handlePromptSubmit(transcript);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <ExploreHeader />
      
      {error && error.includes('API key') && (
        <ErrorAlert 
          error={error} 
          aiModel={aiModel} 
          onRetry={handleRetry} 
        />
      )}

      <div className="mb-8">
        <PromptInput 
          onSubmit={handlePromptSubmit}
          onTranscript={handleTranscript}
          isProcessing={loading} 
          defaultValue=""
          placeholder="Tell us about your dream trip. For example: A 5-day moderate hiking trip near Portland with waterfall views and minimal crowds"
        />
      </div>

      <TripResults 
        trips={trips}
        loading={loading}
        error={error}
        errorDetails={errorDetails}
        thinking={thinking}
        showThinking={showThinking}
        onRetry={() => handlePromptSubmit('')}
        onSaveTrip={handleSaveTrip}
      />
    </div>
  );
};

export default Explore;
