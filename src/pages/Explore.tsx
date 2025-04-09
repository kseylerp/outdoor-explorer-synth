
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
    handleRetry,
    handleSaveTrip
  } = useTrips();

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
