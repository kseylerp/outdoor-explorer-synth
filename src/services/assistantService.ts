
import { supabase } from '@/integrations/supabase/client';
import { AssistantResponse, AssistantResult } from '@/types/assistants';

export async function createThread(): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('openai-assistants', {
    body: { action: 'create_thread' },
  });

  if (error) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }

  // Handle the case where the API key is not configured
  if (data && data.error && data.error === 'OpenAI API key is not configured') {
    throw new Error(`OpenAI API key is not configured: ${data.details}`);
  }

  if (!data || !data.threadId) {
    throw new Error('No threadId returned from create_thread');
  }

  console.log('Successfully created thread:', data.threadId);
  return data.threadId;
}

export async function sendMessageToAssistant(
  message: string,
  threadId: string
): Promise<AssistantResult | null> {
  const { data, error } = await supabase.functions.invoke('openai-assistants', {
    body: { 
      action: 'post_message',
      message: message,
      threadId: threadId
    },
  });

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from post_message');
  }
  
  // Handle the case where the API key is not configured
  if (data.error && data.error === 'OpenAI API key is not configured') {
    throw new Error(`OpenAI API key is not configured: ${data.details}`);
  }

  const response = data as AssistantResponse;
  let textContent = '';
  
  if (response.message) {
    // Process the assistant message
    textContent = response.message.content
      .filter(item => item.type === 'text')
      .map(item => item.text?.value || '')
      .join('\n');
  }

  return {
    threadId,
    response: textContent,
    tripData: response.tripData
  };
}

export async function handoffToResearchAssistant(
  threadId: string
): Promise<AssistantResult | null> {
  const { data, error } = await supabase.functions.invoke('openai-assistants', {
    body: { 
      action: 'handoff',
      threadId: threadId
    },
  });

  if (error) {
    throw new Error(`Handoff failed: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from handoff');
  }
  
  // Handle the case where the API key is not configured
  if (data.error && data.error === 'OpenAI API key is not configured') {
    throw new Error(`OpenAI API key is not configured: ${data.details}`);
  }

  const response = data as AssistantResponse;
  let textContent = '';
  
  if (response.message) {
    textContent = response.message.content
      .filter(item => item.type === 'text')
      .map(item => item.text?.value || '')
      .join('\n');
  }

  return {
    response: textContent,
    tripData: response.tripData
  };
}
