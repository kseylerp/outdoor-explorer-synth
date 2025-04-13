
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { createThread, sendMessageToAssistant, handoffToResearchAssistant } from '@/services/assistantService';
import { AssistantState, AssistantResult } from '@/types/assistants';

export function useAssistants() {
  const [state, setState] = useState<AssistantState>({
    threadId: null,
    loading: false,
    error: null,
    errorDetails: null,
    assistantResponse: null,
    tripData: null
  });

  // Initialize a thread
  const initializeThread = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null, errorDetails: null }));
      
      const threadId = await createThread();
      setState(prev => ({ ...prev, threadId }));
      return threadId;
    } catch (err: any) {
      console.error('Error initializing thread:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize conversation',
        errorDetails: err.message
      }));
      toast({
        title: 'Error',
        description: 'Failed to initialize conversation. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Send a message to the assistant
  const sendMessage = useCallback(async (message: string, currentThreadId: string | null = null) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        assistantResponse: null,
        error: null,
        errorDetails: null
      }));
      
      // If no threadId, initialize one first
      const threadToUse = currentThreadId || state.threadId || await initializeThread();
      
      if (!threadToUse) {
        throw new Error('Could not create or retrieve thread ID');
      }

      const result = await sendMessageToAssistant(message, threadToUse);
      
      if (!result) {
        throw new Error('No result returned from assistant');
      }

      // Set thread ID if not already set
      if (!state.threadId) {
        setState(prev => ({ ...prev, threadId: threadToUse }));
      }

      // Update assistant response and trip data
      setState(prev => ({
        ...prev,
        assistantResponse: result.response || null,
        tripData: result.tripData || null
      }));

      return result;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to get response from assistant',
        errorDetails: err.message
      }));
      toast({
        title: 'Error',
        description: 'Failed to get response from assistant. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.threadId, initializeThread]);

  // Handoff to research assistant
  const handoffToResearch = useCallback(async (currentThreadId: string | null = null) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null, errorDetails: null }));
      
      const threadToUse = currentThreadId || state.threadId;
      if (!threadToUse) {
        throw new Error('No thread ID available for handoff');
      }

      const result = await handoffToResearchAssistant(threadToUse);
      
      if (!result) {
        throw new Error('No result returned from handoff');
      }

      setState(prev => ({
        ...prev,
        assistantResponse: result.response || null,
        tripData: result.tripData || null
      }));

      return result;
    } catch (err: any) {
      console.error('Error in handoff to research:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to hand off to research assistant',
        errorDetails: err.message
      }));
      toast({
        title: 'Error',
        description: 'Failed to get recommendations from research assistant. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.threadId]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      threadId: null,
      loading: false,
      error: null,
      errorDetails: null,
      assistantResponse: null,
      tripData: null
    });
  }, []);

  // Return all the values and functions
  return {
    ...state,
    sendMessage,
    handoffToResearch,
    initializeThread,
    reset
  };
}
