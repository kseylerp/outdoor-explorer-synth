
import { toast } from "sonner";

export { toast };

export const useToast = () => {
  return {
    toast
  };
};
</lov-code>

I'll implement the changes to simplify the conversation flow and properly leverage OpenAI Assistants. Let me make these changes in stages for clarity.

<lov-code>
First, let's update the `useConversation` hook to let OpenAI manage the conversation flow and remove the artificial conversation stages:

<lov-write file_path="src/hooks/useConversation.ts">
import { useState, useEffect, useCallback } from 'react';
import { useAssistants } from '@/hooks/useAssistants';

/**
 * Interface for chat message objects
 */
export interface ChatMessage {
  content: string;
  isUser: boolean;
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
    initializeThread
  } = useAssistants();

  const [triageMessages, setTriageMessages] = useState<Array<ChatMessage>>([]);
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);
  const [pendingBotMessage, setPendingBotMessage] = useState<string | null>(null);
  
  // Initialize the thread and conversation when the component loads
  useEffect(() => {
    const initConversation = async () => {
      // Create a thread if we don't have one
      if (!threadId) {
        console.log('Initializing conversation and creating thread...');
        const newThreadId = await initializeThread();
        
        if (newThreadId) {
          // Start with a welcome message from the assistant
          console.log('Thread created, sending initial message to get Triage AI response');
          await sendMessage("Start a new conversation", newThreadId);
        } else {
          console.error('Failed to initialize thread');
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
      console.log('Received assistant response:', assistantResponse);
      addBotMessage(assistantResponse);
      setPendingBotMessage(null);

      // Check if there's trip data from the assistant
      if (assistantTripData) {
        // Handle the trip data
        console.log("Trip data received from assistant:", assistantTripData);
        handleVoiceTripData(assistantTripData, assistantResponse);
      }
    }
  }, [assistantResponse, pendingBotMessage, assistantTripData, handleVoiceTripData]);

  // Process user messages through the OpenAI assistant
  const processWithAssistant = async (message: string) => {
    setPendingBotMessage(""); // Set a pending message to show loading state
    
    try {
      console.log(`Processing message with assistant: "${message}"`);
      await sendMessage(message, threadId);
    } catch (error) {
      console.error("Error processing with assistant:", error);
      addBotMessage("I'm sorry, I encountered an error while processing your request. Please try again.");
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
  };

  const handleRetryConnection = async () => {
    // Reset the connection and try to initialize a thread again
    console.log('Retrying API connection...');
    
    const newThreadId = await initializeThread();
    if (newThreadId) {
      console.log('Successfully created new thread:', newThreadId);
      // If the thread initialization is successful, resume conversation
      if (triageMessages.length > 0) {
        // Find the last user message and resend it
        const lastUserMessage = [...triageMessages]
          .reverse()
          .find(msg => msg.isUser);
        
        if (lastUserMessage) {
          console.log('Resending last user message:', lastUserMessage.content);
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
  };

  const handleTranscript = (transcript: string, tripData?: any) => {
    console.log('handleTranscript received:', transcript);
    
    // Add the user message to triage messages
    setTriageMessages(prev => [...prev, {content: transcript, isUser: true}]);
    setHasSubmittedPrompt(true);
    
    if (tripData) {
      handleVoiceTripData(tripData, transcript);
    } else {
      // Process with the assistant
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
