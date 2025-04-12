
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface AssistantMessage {
  content: Array<{
    type: string;
    text?: {
      value: string;
    };
  }>;
  role: 'assistant' | 'user';
  id: string;
  created_at: number;
}

interface AssistantResponse {
  message: AssistantMessage | null;
  tripData: any | null;
  runStatus: string;
}

export function useAssistants() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any | null>(null);
  const { toast } = useToast();

  // Initialize a thread
  const initializeThread = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      
      const { data, error } = await supabase.functions.invoke('openai-assistants', {
        body: { action: 'create_thread' },
      });

      if (error) {
        throw new Error(`Failed to create thread: ${error.message}`);
      }

      if (!data || !data.threadId) {
        throw new Error('No threadId returned from create_thread');
      }

      console.log('Successfully created thread:', data.threadId);
      setThreadId(data.threadId);
      return data.threadId;
    } catch (err: any) {
      console.error('Error initializing thread:', err);
      setError('Failed to initialize conversation');
      setErrorDetails(err.message);
      toast({
        title: 'Error',
        description: 'Failed to initialize conversation. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Send a message to the assistant
  const sendMessage = useCallback(async (message: string, currentThreadId: string | null = null) => {
    try {
      setLoading(true);
      setAssistantResponse(null);
      setError(null);
      setErrorDetails(null);
      
      // If no threadId, initialize one first
      const threadToUse = currentThreadId || threadId || await initializeThread();
      
      if (!threadToUse) {
        throw new Error('Could not create or retrieve thread ID');
      }

      const { data, error } = await supabase.functions.invoke('openai-assistants', {
        body: { 
          action: 'post_message',
          message: message,
          threadId: threadToUse
        },
      });

      if (error) {
        throw new Error(`Failed to send message: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from post_message');
      }

      const response = data as AssistantResponse;
      let textContent = '';
      
      if (response.message) {
        // Process the assistant message
        textContent = response.message.content
          .filter(item => item.type === 'text')
          .map(item => item.text?.value || '')
          .join('\n');
        
        setAssistantResponse(textContent);
      }

      // Set thread ID if not already set
      if (!threadId) {
        setThreadId(threadToUse);
      }

      // Check for trip data
      if (response.tripData) {
        setTripData(response.tripData);
      }

      return {
        threadId: threadToUse,
        response: textContent,
        tripData: response.tripData
      };
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Failed to get response from assistant');
      setErrorDetails(err.message);
      toast({
        title: 'Error',
        description: 'Failed to get response from assistant. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [threadId, initializeThread, toast]);

  // Handoff to research assistant
  const handoffToResearch = useCallback(async (currentThreadId: string | null = null) => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      
      const threadToUse = currentThreadId || threadId;
      if (!threadToUse) {
        throw new Error('No thread ID available for handoff');
      }

      const { data, error } = await supabase.functions.invoke('openai-assistants', {
        body: { 
          action: 'handoff',
          threadId: threadToUse
        },
      });

      if (error) {
        throw new Error(`Handoff failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from handoff');
      }

      const response = data as AssistantResponse;
      
      // Process the research assistant message
      let textContent = '';
      if (response.message) {
        textContent = response.message.content
          .filter(item => item.type === 'text')
          .map(item => item.text?.value || '')
          .join('\n');
        
        setAssistantResponse(textContent);
      }

      // Check for trip data
      if (response.tripData) {
        setTripData(response.tripData);
      }

      return {
        response: textContent,
        tripData: response.tripData
      };
    } catch (err: any) {
      console.error('Error in handoff to research:', err);
      setError('Failed to hand off to research assistant');
      setErrorDetails(err.message);
      toast({
        title: 'Error',
        description: 'Failed to get recommendations from research assistant. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [threadId, toast]);

  // Reset state
  const reset = useCallback(() => {
    setThreadId(null);
    setError(null);
    setErrorDetails(null);
    setAssistantResponse(null);
    setTripData(null);
  }, []);

  return {
    threadId,
    loading,
    error,
    errorDetails,
    assistantResponse,
    tripData,
    sendMessage,
    handoffToResearch,
    initializeThread,
    reset
  };
}
