
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AssistantResponse {
  text: string;
  activityData?: any;
}

export function useGuideAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // Initialize a conversation thread
  const createThread = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('openai-assistants', {
        body: { 
          action: 'create_thread' 
        },
      });

      if (error) throw new Error(error.message);
      if (!data || !data.threadId) throw new Error('No thread ID returned');
      
      setThreadId(data.threadId);
      return data.threadId;
    } catch (err: any) {
      console.error('Error creating thread:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the Guide Recommendation assistant
  const sendMessage = async (message: string): Promise<AssistantResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get or create a thread ID
      const currentThreadId = threadId || await createThread();
      if (!currentThreadId) {
        throw new Error('Could not create conversation thread');
      }
      
      // Use the Guide Recommendation assistant ID
      const guideAssistantId = 'asst_Iu9FlDtvpSjIdIN1mNF3MZlf';
      
      // Send message to the assistant
      const { data, error } = await supabase.functions.invoke('openai-assistants', {
        body: { 
          action: 'post_message',
          message,
          threadId: currentThreadId,
          assistantId: guideAssistantId
        },
      });

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No response data received');
      
      // Extract text content from response
      let textContent = '';
      if (data.message) {
        textContent = data.message.content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text?.value || '')
          .join('\n');
      }
      
      return {
        text: textContent,
        activityData: data.tripData
      };
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Save activity to the database
  const saveActivity = async (activityData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Process images if any
      let imageUrls: string[] = [];
      if (activityData.images && activityData.images.length > 0) {
        imageUrls = await uploadImages(activityData.images);
      }
      
      // Prepare activity data
      const activity = {
        title: activityData.title || '',
        description: activityData.description || '',
        price: activityData.price || '',
        duration: activityData.duration || '',
        danger_level: activityData.dangerLevel || 'low',
        permit_required: activityData.permitRequired || false,
        permit_details: activityData.permitDetails || '',
        guide_id: activityData.guideId || '00000000-0000-0000-0000-000000000000', // Default guide ID
        company_recommendations: JSON.stringify(activityData.recommendations || []),
        target_audience: activityData.targetAudience || '',
        image_urls: imageUrls
      };
      
      // Insert into the activities table
      const { data, error } = await supabase
        .from('activities')
        .insert(activity)
        .select();
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error('Error saving activity:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to upload images to storage
  const uploadImages = async (images: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    
    for (const image of images) {
      try {
        const filename = `${Date.now()}-${image.name}`;
        const path = `activity-images/${filename}`;
        
        const { data, error } = await supabase.storage
          .from('activities')
          .upload(path, image);
        
        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }
        
        const { data: urlData } = supabase.storage
          .from('activities')
          .getPublicUrl(path);
        
        if (urlData && urlData.publicUrl) {
          imageUrls.push(urlData.publicUrl);
        }
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }
    
    return imageUrls;
  };

  return {
    isLoading,
    error,
    threadId,
    sendMessage,
    saveActivity
  };
}
