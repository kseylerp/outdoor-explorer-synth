
// Type definitions for the OpenAI assistants function

export interface AssistantResponse {
  message?: {
    content: Array<{
      type: string;
      text?: {
        value: string;
      };
    }>;
    role: 'assistant' | 'user';
    id: string;
    created_at: number;
  };
  tripData?: any;
  runStatus: string;
}

export interface RequestBody {
  action: 'create_thread' | 'get_thread' | 'post_message' | 'handoff';
  message?: string;
  threadId?: string;
  assistantId?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
