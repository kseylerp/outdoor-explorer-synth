
import { useState, useEffect, useCallback } from 'react';
import { useAssistants } from '@/hooks/useAssistants';

/**
 * Interface for chat message objects
 */
export interface ChatMessage {
  content: string;
  isUser: boolean;
}

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

export const useConversation = (handleVoiceTripData: (tripData: any, transcript: string) => void) => {
  const {
    threadId,
    loading: assistantLoading,
    error: assistantError,
    errorDetails: assistantErrorDetails,
    assistantResponse,
    tripData: assistantTripData,
    sendMessage,
    handoffToResearch,
    initializeThread
  } = useAssistants();

  // State for the conversation flow
  const [conversationStage, setConversationStage] = useState<ConversationStage>('welcome');
  const [triageMessages, setTriageMessages] = useState<Array<ChatMessage>>([]);
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
  const [pendingBotMessage, setPendingBotMessage] = useState<string | null>(null);
  const [apiConnectionFailed, setApiConnectionFailed] = useState(false);
  
  // Initialize the thread and conversation when the component loads
  useEffect(() => {
    const initConversation = async () => {
      // Create a thread if we don't have one
      if (!threadId) {
        const newThreadId = await initializeThread();
        
        if (newThreadId) {
          // Start with a welcome message from the assistant
          const result = await sendMessage("Start a new conversation with a welcome message", newThreadId);
          if (!result) {
            // If we couldn't get a welcome message from the assistant, provide a fallback
            addBotMessage("Hi there! I'd love to help you plan your next adventure. What kind of outdoor experience are you looking for?");
            setApiConnectionFailed(true);
          }
        } else {
          // Fallback welcome message if thread initialization fails
          addBotMessage("Hi there! I'd love to help you plan your next adventure. What kind of outdoor experience are you looking for?");
          setApiConnectionFailed(true);
        }
      }
    };

    if (triageMessages.length === 0) {
      initConversation();
    }
  }, [threadId, sendMessage, initializeThread, triageMessages.length]);

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
    
    try {
      if (apiConnectionFailed) {
        // If API connection is known to have failed, don't try again, just add a simulated response
        setTimeout(() => {
          addBotMessage("I'm here to help with your adventure plans! Could you tell me more about what type of outdoor activity you're interested in?");
        }, 1000);
        return;
      }
      
      const result = await sendMessage(message, threadId);
      
      if (!result) {
        // If sendMessage failed, set apiConnectionFailed flag
        setApiConnectionFailed(true);
        addBotMessage("I'd be happy to help plan your adventure. What activities are you interested in?");
      } else if (result.tripData) {
        console.log("Trip data received:", result.tripData);
        // We'll let the useEffect handle adding the message and processing trip data
      }
    } catch (error) {
      console.error("Error processing with assistant:", error);
      addBotMessage("I'm sorry, I encountered an error while processing your request. Please try again.");
      setApiConnectionFailed(true);
    }
  };

  // Perform a handoff to research assistant
  const performHandoff = async () => {
    setPendingBotMessage("Let me create some detailed trip recommendations for you...");
    setConversationStage('research');
    
    try {
      if (apiConnectionFailed) {
        // If API connection is known to have failed, don't try again, just add a simulated response
        setTimeout(() => {
          addBotMessage("Based on our conversation, I'd recommend exploring hiking trails in the Pacific Northwest. The Columbia River Gorge has beautiful waterfalls and trails for various skill levels.");
        }, 2000);
        return;
      }
      
      const result = await handoffToResearch(threadId);
      
      if (!result) {
        // If handoff failed, set apiConnectionFailed flag
        setApiConnectionFailed(true);
        addBotMessage("Based on what you've told me, I'd suggest a weekend trip to explore some local hiking trails with moderate difficulty.");
      } else if (result.tripData) {
        console.log("Trip data received from research handoff:", result.tripData);
        // Trip data will be handled by the useEffect
      }
    } catch (error) {
      console.error("Error in handoff to research:", error);
      addBotMessage("I'm sorry, I encountered an error while preparing your trip recommendations. Please try again.");
      setApiConnectionFailed(true);
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

  const handleRetryConnection = () => {
    // Reset the api connection failed flag
    setApiConnectionFailed(false);
    
    // First try to initialize a thread again
    initializeThread().then(newThreadId => {
      if (newThreadId) {
        // If the thread initialization is successful, resume conversation
        if (triageMessages.length > 0) {
          // Find the last user message and resend it
          const lastUserMessage = [...triageMessages]
            .reverse()
            .find(msg => msg.isUser);
          
          if (lastUserMessage) {
            processWithAssistant(lastUserMessage.content);
          } else {
            // No user message found, send a greeting to start
            processWithAssistant("Hello");
          }
        } else {
          // No messages yet, send a greeting
          processWithAssistant("Start conversation");
        }
      }
    });
  };

  // Check if we should perform handoff
  useEffect(() => {
    const shouldHandoff = () => {
      // This is a simple heuristic - you might want more sophisticated logic
      // If we have collected enough information in the exploring stage, proceed to research
      if (conversationStage === 'exploring' && 
          triageMessages.length >= 6 && 
          !assistantLoading && 
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
  }, [triageMessages, conversationStage, assistantLoading, pendingBotMessage]);

  const handleTranscript = (transcript: string, tripData?: any) => {
    console.log('handleTranscript received:', transcript);
    
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

  return {
    triageMessages,
    pendingBotMessage,
    hasSubmittedPrompt,
    assistantLoading,
    assistantError,
    assistantErrorDetails,
    handleUserPrompt,
    handleTranscript,
    handleRetryConnection
  };
};
