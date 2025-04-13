
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Create a thread for the assistant conversation
export const createAssistantThread = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('openai-assistants', {
      body: { 
        action: 'create_thread' 
      },
    });

    if (error) {
      console.error('Error creating thread:', error);
      throw new Error(error.message);
    }
    if (!data || !data.threadId) {
      console.error('No thread ID returned:', data);
      throw new Error('No thread ID returned');
    }
    
    console.log('Thread created successfully:', data.threadId);
    return data.threadId;
  } catch (err: any) {
    console.error('Error creating assistant thread:', err);
    toast.error('Failed to initialize chat. Please try again.');
    return null;
  }
};

// Send a message to the assistant and get a response
export const sendAssistantMessage = async (message: string, threadId: string): Promise<any> => {
  try {
    // Use the Triage assistant ID - this ID should be updated if needed
    const triageAssistantId = 'asst_zHGdllTGFX5XIkPpnsKmWmX5';
    
    console.log(`Sending message to assistant ${triageAssistantId} in thread ${threadId}`);
    
    // Send message to the assistant
    const { data, error } = await supabase.functions.invoke('openai-assistants', {
      body: { 
        action: 'post_message',
        message,
        threadId: threadId,
        assistantId: triageAssistantId
      },
    });

    if (error) {
      console.error('Error from edge function:', error);
      throw new Error(error.message);
    }
    if (!data) {
      console.error('No data received from API');
      throw new Error('No response data received');
    }
    
    console.log('Response received from assistant:', data);
    
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
    console.error('Error sending message to assistant:', err);
    throw err;
  }
};
