
import React, { useState, useEffect } from 'react';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { useTrips } from '@/hooks/useTrips';
import TriageResponseBubble from '@/components/prompt/TriageResponseBubble';
import { useAssistants } from '@/hooks/useAssistants';

// Define conversation stages for our boolean conversation flow
type ConversationStage = 
  | 'welcome'
  | 'exploring'
  | 'research';

interface UserPreferences {
  region: string;
  timing: string;
  wantsTimingRecommendation: boolean | null;
  skillLevel: string;
  duration: string;
  equipment: string;
  groupSize: string;
  interests: string;
}

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
    threadId,
    loading: assistantLoading,
    error: assistantError,
    errorDetails: assistantErrorDetails,
    assistantResponse,
    tripData: assistantTripData,
    sendMessage,
    handoffToResearch
  } = useAssistants();

  // Combined loading and error states
  const loading = tripsLoading || assistantLoading;
  const error = tripsError || assistantError;
  const errorDetails = tripsErrorDetails || assistantErrorDetails;
  
  // State for the conversation flow
  const [conversationStage, setConversationStage] = useState<ConversationStage>('welcome');
  const [triageMessages, setTriageMessages] = useState<Array<{content: string, isUser: boolean}>>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    region: '',
    timing: '',
    wantsTimingRecommendation: null,
    skillLevel: '',
    duration: '',
    equipment: '',
    groupSize: '',
    interests: ''
  });
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [pendingBotMessage, setPendingBotMessage] = useState<string | null>(null);
  
  // Initialize the conversation with welcome message
  useEffect(() => {
    if (triageMessages.length === 0) {
      setTriageMessages([{
        content: "Hi there! I'd love to help you plan your next adventure. What kind of outdoor experience are you looking for?",
        isUser: false
      }]);
    }
  }, [triageMessages.length]);

  // Handle assistant response changes
  useEffect(() => {
    if (assistantResponse && pendingBotMessage === null) {
      addBotMessage(assistantResponse);
      setPendingBotMessage(null);

      // Check if there's trip data from the assistant
      if (assistantTripData) {
        // Handle the trip data - either pass to handleVoiceTripData or handle it directly
        console.log("Trip data received from assistant:", assistantTripData);
        handleVoiceTripData(assistantTripData, assistantResponse);
      }

      // If we were in welcome stage, move to exploring
      if (conversationStage === 'welcome') {
        setConversationStage('exploring');
      }
    }
  }, [assistantResponse, pendingBotMessage, assistantTripData, conversationStage, handleVoiceTripData]);

  // Process user messages through the OpenAI assistant
  const processWithAssistant = async (message: string) => {
    setPendingBotMessage(""); // Set a pending message to show loading state
    setIsThinking(true);
    
    try {
      const result = await sendMessage(message, threadId);
      
      if (result && result.tripData) {
        console.log("Trip data received:", result.tripData);
        // We'll let the useEffect handle adding the message and processing trip data
      }
    } catch (error) {
      console.error("Error processing with assistant:", error);
      addBotMessage("I'm sorry, I encountered an error while processing your request. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  // Perform a handoff to research assistant
  const performHandoff = async () => {
    setPendingBotMessage("Let me create some detailed trip recommendations for you...");
    setIsThinking(true);
    setConversationStage('research');
    
    try {
      const result = await handoffToResearch(threadId);
      
      if (result && result.tripData) {
        console.log("Trip data received from research handoff:", result.tripData);
        // Trip data will be handled by the useEffect
      }
    } catch (error) {
      console.error("Error in handoff to research:", error);
      addBotMessage("I'm sorry, I encountered an error while preparing your trip recommendations. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  // Handle transcript and triage the conversation
  const handleTranscript = (transcript: string, tripData?: any) => {
    console.log('Index received transcript:', transcript);
    
    // Add the user message to triage messages
    setTriageMessages(prev => [...prev, {content: transcript, isUser: true}]);
    setHasSubmittedPrompt(true);
    
    if (tripData) {
      handleVoiceTripData(tripData, transcript);
    } else {
      // Process with the assistant instead of local logic
      processWithAssistant(transcript);
    }
  };

  const addBotMessage = (message: string) => {
    setTriageMessages(prev => [...prev, {content: message, isUser: false}]);
  };

  const handleUserPrompt = (prompt: string) => {
    // Add user message to the conversation
    setTriageMessages(prev => [...prev, {content: prompt, isUser: true}]);
    setHasSubmittedPrompt(true);
    
    // Process with the OpenAI assistant
    processWithAssistant(prompt);

    // Update userPreferences.interests for the first message in welcome stage
    if (conversationStage === 'welcome') {
      setUserPreferences(prev => ({...prev, interests: prompt}));
    }
  };

  // Check if we should perform handoff
  useEffect(() => {
    const shouldHandoff = () => {
      // This is a simple heuristic - you might want more sophisticated logic
      // If we have collected enough information in the exploring stage, proceed to research
      if (conversationStage === 'exploring' && 
          triageMessages.length >= 6 && 
          !loading && 
          !pendingBotMessage) {
        
        const lastBotMessages = triageMessages
          .filter(msg => !msg.isUser)
          .slice(-3);
        
        // Look for confirmation questions in recent bot messages
        const confirmationPhrases = [
          'does this sound good',
          'ready to see some options',
          'should i show you',
          'would you like to see',
          'would you like me to generate',
          'shall i create'
        ];
        
        for (const msg of lastBotMessages) {
          const msgLower = msg.content.toLowerCase();
          if (confirmationPhrases.some(phrase => msgLower.includes(phrase))) {
            // Look for a yes response from user
            const lastUserMessage = triageMessages
              .filter(msg => msg.isUser)
              .pop();
            
            if (lastUserMessage) {
              const userMsgLower = lastUserMessage.content.toLowerCase();
              if (userMsgLower.includes('yes') || 
                  userMsgLower.includes('yeah') || 
                  userMsgLower.includes('sure') ||
                  userMsgLower.includes('ok') ||
                  userMsgLower.includes('please')) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    if (shouldHandoff()) {
      performHandoff();
    }
  }, [triageMessages, conversationStage, loading, pendingBotMessage]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col min-h-[calc(100vh-80px)] bg-[#EFF3EE] dark:bg-[#202020]">
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

      <div className="flex-grow flex flex-col">
        {/* Conversation Area */}
        <div className="conversation-container border-b border-gray-200 dark:border-gray-800">
          {triageMessages.length > 0 && (
            <div className="mb-4">
              {triageMessages.map((message, index) => (
                <TriageResponseBubble 
                  key={index}
                  message={message.content}
                  isUser={message.isUser}
                />
              ))}
              {pendingBotMessage !== null && (
                <TriageResponseBubble 
                  message="..."
                  isUser={false}
                  isLoading={true}
                />
              )}
            </div>
          )}
        </div>

        {/* Trip Results Area */}
        <div className="trip-results-container py-4">
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
