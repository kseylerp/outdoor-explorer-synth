
import React from 'react';
import PromptInput from '@/components/PromptInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { useTrips } from '@/hooks/useTrips';
import { useConversation } from '@/hooks/useConversation';
import WelcomeHeader from '@/components/conversation/WelcomeHeader';
import TriageConversation from '@/components/conversation/TriageConversation';
import TripResults from '@/components/trip/TripResults';

const Index = () => {
  const {
    trips,
    loading: tripsLoading,
    error: tripsError,
    errorDetails: tripsErrorDetails,
    thinking,
    handlePromptSubmit,
    handleVoiceTripData,
    handleRetry,
    handleSaveTrip
  } = useTrips();
  
  const {
    triageMessages,
    pendingBotMessage,
    hasSubmittedPrompt,
    assistantLoading,
    assistantError,
    assistantErrorDetails,
    handleUserPrompt,
    handleTranscript,
    handleRetryConnection
  } = useConversation(handleVoiceTripData);

  // Combined loading and error states
  const loading = tripsLoading || assistantLoading;
  const error = tripsError || assistantError;
  const errorDetails = tripsErrorDetails || assistantErrorDetails;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col min-h-[calc(100vh-80px)] bg-[#EFF3EE] dark:bg-[#202020]">
      <WelcomeHeader hasSubmittedPrompt={hasSubmittedPrompt} />

      <div className="flex-grow flex flex-col">
        {/* Conversation Area */}
        <div className="conversation-container border-b border-gray-200 dark:border-gray-800">
          <TriageConversation 
            messages={triageMessages}
            pendingBotMessage={pendingBotMessage}
          />
        </div>

        {/* Trip Results Area */}
        <div className="trip-results-container py-4">
          <TripResults
            trips={trips}
            loading={loading}
            error={error}
            errorDetails={errorDetails}
            thinking={thinking}
            handleRetryConnection={handleRetryConnection}
            handleSaveTrip={handleSaveTrip}
          />
        </div>
      </div>

      {/* Sticky Prompt Input */}
      <div className="sticky-prompt">
        <PromptInput 
          onSubmit={handleUserPrompt}
          onTranscript={handleTranscript}
          isProcessing={loading} 
          placeholder="Tell us about your dream trip..." 
        />
      </div>
    </div>
  );
};

export default Index;
