
import { useState, useCallback } from 'react';

/**
 * Interface for chat message objects
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

/**
 * Custom hook to manage chat messages and related functionality
 * 
 * Features:
 * - Message state management
 * - Adding user and assistant messages
 * - Processing transcripts
 * - Handling message sending
 * 
 * @returns Chat message state and functions
 */
export const useChatMessages = () => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState('');

  /**
   * Add a user message to the chat history
   * @param content Message content
   */
  const addUserMessage = useCallback((content: string) => {
    setHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date()
      }
    ]);
  }, []);

  /**
   * Add an assistant message to the chat history
   * @param content Message content
   */
  const addAssistantMessage = useCallback((content: string) => {
    setHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date()
      }
    ]);
  }, []);

  /**
   * Process a transcript from voice input
   * 
   * This first triggers the triage agent before proceeding to any other action
   * 
   * @param transcript Voice input transcript
   */
  const processTranscript = useCallback((transcript: string) => {
    console.log("Processing transcript:", transcript);
    setPendingTranscript(transcript);
    
    // First, add the transcript as a user message
    addUserMessage(transcript);
    
    // Set processing state to true to indicate we're waiting for a response
    setIsProcessing(true);
    
    // Simulate the triage agent processing and responding
    // In a real application, this would be an API call
    setTimeout(() => {
      // Add the assistant response
      addAssistantMessage("I understand you want to travel. Let me help you plan that. Can you tell me more about your destination preferences?");
      
      // End processing state
      setIsProcessing(false);
      
      // Clear pending transcript
      setPendingTranscript('');
    }, 1500);
  }, [addUserMessage, addAssistantMessage]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    
    // Add the user message to the history
    addUserMessage(message);
    
    // Set processing state to true
    setIsProcessing(true);
    
    // Simulate the assistant processing and responding
    // In a real application, this would be an API call
    setTimeout(() => {
      // Add the assistant response
      addAssistantMessage("I'm processing your request for a trip. Let me search for some options for you. What kind of experience are you looking for?");
      
      // End processing state
      setIsProcessing(false);
    }, 1500);
  }, [message, addUserMessage, addAssistantMessage]);

  return {
    history,
    message,
    isProcessing,
    pendingTranscript,
    setMessage,
    handleSendMessage,
    setIsProcessing,
    addUserMessage,
    addAssistantMessage,
    processTranscript
  };
};
