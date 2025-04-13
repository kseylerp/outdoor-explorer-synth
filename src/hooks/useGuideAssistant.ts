
import { useState } from 'react';
import { createAssistantThread, sendAssistantMessage } from '@/services/guide/assistantService';
import { saveActivity } from '@/services/guide/activityService';

export function useGuideAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // Initialize a conversation thread
  const createThread = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Creating new thread...');
      const newThreadId = await createAssistantThread();
      
      if (newThreadId) {
        console.log('Thread created:', newThreadId);
        setThreadId(newThreadId);
      } else {
        console.error('Failed to create thread');
      }
      
      return newThreadId;
    } catch (err: any) {
      console.error('Error in createThread:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the Triage assistant
  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get or create a thread ID
      const currentThreadId = threadId || await createThread();
      if (!currentThreadId) {
        throw new Error('Could not create conversation thread');
      }
      
      console.log(`Sending message to thread ${currentThreadId}: ${message}`);
      return await sendAssistantMessage(message, currentThreadId);
    } catch (err: any) {
      console.error('Error in sendMessage:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Save activity to the database with images
  const saveActivityWithImages = async (activityData: any, images: File[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await saveActivity(activityData, images);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    threadId,
    sendMessage,
    saveActivity: saveActivityWithImages
  };
}
