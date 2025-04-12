
export interface AssistantMessageContent {
  type: string;
  text?: {
    value: string;
  };
}

export interface AssistantMessage {
  content: Array<AssistantMessageContent>;
  role: 'assistant' | 'user';
  id: string;
  created_at: number;
}

export interface AssistantResponse {
  message: AssistantMessage | null;
  tripData: any | null;
  runStatus: string;
}

export interface AssistantResult {
  threadId?: string;
  response?: string;
  tripData?: any | null;
}

export interface AssistantState {
  threadId: string | null;
  loading: boolean;
  error: string | null;
  errorDetails: string | null;
  assistantResponse: string | null;
  tripData: any | null;
}
