
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
      // Add the triage agent response
      addAssistantMessage("I'm your adventure assistant. I understand you're looking for travel recommendations. Could you tell me more about what kind of experience you're looking for?");
      
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
    
    // Simulate the triage agent processing and responding
    // In a real application, this would be an API call
    setTimeout(() => {
      // First, add the triage agent response
      addAssistantMessage("I'm your adventure assistant. Based on your message, I can help you plan a trip. What type of activities are you interested in?");
      
      // End processing state after the triage agent response
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
