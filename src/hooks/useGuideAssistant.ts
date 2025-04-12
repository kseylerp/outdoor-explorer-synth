
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
      
      const newThreadId = await createAssistantThread();
      if (newThreadId) {
        setThreadId(newThreadId);
      }
      
      return newThreadId;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the Guide Recommendation assistant
  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get or create a thread ID
      const currentThreadId = threadId || await createThread();
      if (!currentThreadId) {
        throw new Error('Could not create conversation thread');
      }
      
      return await sendAssistantMessage(message, currentThreadId);
    } catch (err: any) {
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
