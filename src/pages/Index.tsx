
import React, { useState, useEffect } from 'react';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { useTrips } from '@/hooks/useTrips';
import ResponseDialog from '@/components/prompt/ResponseDialog';
import TriageResponseBubble from '@/components/prompt/TriageResponseBubble';

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
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [quickResponseOptions, setQuickResponseOptions] = useState<Array<{text: string, value: string}>>([]);
  const [triageMessages, setTriageMessages] = useState<Array<{content: string, isUser: boolean}>>([]);
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);
  
  // Handle voice transcript and potential trip data
  const handleTranscript = (transcript: string, tripData?: any) => {
    console.log('Index received transcript:', transcript);
    console.log('Index received trip data:', tripData);
    
    // Add the user message to triage messages
    setTriageMessages(prev => [...prev, {content: transcript, isUser: true}]);
    setHasSubmittedPrompt(true);
    
    if (tripData) {
      handleVoiceTripData(tripData, transcript);
    } else {
      // Display a temporary "thinking" triage message
      setTriageMessages(prev => [...prev, {
        content: "I'm analyzing your request...",
        isUser: false
      }]);
      
      handlePromptSubmit(transcript);
      
      // After a short delay, add AI response to triage messages
      setTimeout(() => {
        setTriageMessages(prev => {
          // Replace the "thinking" message with the actual response
          const newMessages = [...prev];
          if (newMessages.length > 1 && newMessages[newMessages.length - 1].content === "I'm analyzing your request...") {
            newMessages.pop(); // Remove the thinking message
          }
          
          // Add follow-up questions
          setDialogQuestion("Do you want to refine your adventure options?");
          setQuickResponseOptions([
            { text: "More outdoor activities", value: "I'd like more outdoor adventure activities" },
            { text: "More relaxing options", value: "Show me more relaxing options" },
            { text: "Budget friendly", value: "Give me more budget-friendly options" }
          ]);
          setTimeout(() => setShowResponseDialog(true), 2000);
          
          return [...newMessages, {
            content: "I'm looking for some adventure options based on your request. I'll show the results above once they're ready.",
            isUser: false
          }];
        });
      }, 2000);
    }
  };

  // Handle dialog response submission
  const handleDialogResponse = (response: string) => {
    console.log('Dialog response received:', response);
    
    // Add the response to triage messages
    setTriageMessages(prev => [...prev, {content: response, isUser: true}]);
    
    handlePromptSubmit(response);
    
    // Add AI response to triage messages
    setTimeout(() => {
      setTriageMessages(prev => [...prev, {
        content: "Updating your adventure options based on your feedback...",
        isUser: false
      }]);
    }, 1000);
    
    setShowResponseDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col min-h-[calc(100vh-80px)] bg-[#F4F7F3] dark:bg-[#202020]">
      {!hasSubmittedPrompt && (
        <div className="mb-8 text-center my-[20px] mx-0">
          <h1 className="text-4xl font-bold mb-4 py-0 mx-[2px] md:text-5xl my-px">
            Let's find an <span className="offbeat-gradient">offbeat</span> adventure
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-200 text-base my-0">
            Powered by local guides: explore, plan, and experience better trips
          </p>
        </div>
      )}

      <div className="flex-grow overflow-y-auto">
        {/* Response Dialog for follow-up questions */}
        {dialogQuestion && (
          <ResponseDialog
            isOpen={showResponseDialog}
            onClose={() => setShowResponseDialog(false)}
            question={dialogQuestion}
            onSubmit={handleDialogResponse}
            options={quickResponseOptions}
          />
        )}

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
          <div className="space-y-8 mb-8">
            {trips.map((trip, index) => (
              <div key={trip.id || `trip-${index}`} className="relative">
                {trips.length > 1 && (
                  <div className="absolute -top-4 -left-2 z-10">
                    <span className="bg-[#65558F] text-white text-sm font-medium px-3 py-1 rounded-full">
                      Option {index + 1}
                    </span>
                  </div>
                )}
                <TripCard trip={trip} onSave={() => handleSaveTrip(trip)} />
              </div>
            ))}
          </div>
        )}
        
        {/* Triage Message Bubbles */}
        {triageMessages.length > 0 && (
          <div className="mb-6 px-4">
            {triageMessages.map((message, index) => (
              <TriageResponseBubble 
                key={index}
                message={message.content}
                isUser={message.isUser}
              />
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-4 mt-4">
        <PromptInput 
          onSubmit={(prompt) => {
            handlePromptSubmit(prompt);
            setHasSubmittedPrompt(true);
            setTriageMessages(prev => [...prev, {content: prompt, isUser: true}]);
            setTimeout(() => {
              setTriageMessages(prev => [...prev, {
                content: "I'm updating your adventure options based on your new request...",
                isUser: false
              }]);
            }, 500);
          }} 
          onTranscript={handleTranscript}
          isProcessing={loading} 
          placeholder="Tell us about your dream trip..." 
        />
      </div>
    </div>
  );
};

export default Index;
