
// Request body types
export interface RequestBody {
  action: 'create_thread' | 'get_thread' | 'post_message' | 'handoff';
  message?: string;
  threadId?: string;
  assistantId?: string;
}

// Response for assistant communications
export interface AssistantResponse {
  message?: any;
  tripData?: any;
  runStatus?: string;
  error?: string;
  details?: string;
}

// Enhanced error response with help text
export interface ErrorResponse {
  error: string;
  details: string;
  help: string | null;
  status?: string;
  code?: string;
}
