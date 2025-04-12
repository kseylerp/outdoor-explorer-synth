
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

    if (error) throw new Error(error.message);
    if (!data || !data.threadId) throw new Error('No thread ID returned');
    
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
    // Use the Guide Recommendation assistant ID
    const guideAssistantId = 'asst_Iu9FlDtvpSjIdIN1mNF3MZlf';
    
    // Send message to the assistant
    const { data, error } = await supabase.functions.invoke('openai-assistants', {
      body: { 
        action: 'post_message',
        message,
        threadId: threadId,
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
    console.error('Error sending message to assistant:', err);
    throw err;
  }
};
