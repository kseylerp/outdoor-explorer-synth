
export type AgentRole = 
  | 'triage' 
  | 'search' 
  | 'knowledge' 
  | 'account';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  agentRole?: AgentRole;
  metadata?: Record<string, any>;
}

export interface AgentRequest {
  messages: AgentMessage[];
  userId?: string;
  context?: Record<string, any>;
}

export interface AgentResponse {
  message: AgentMessage;
  handoff?: {
    to: AgentRole;
    reason: string;
    contextData?: Record<string, any>;
  };
  actions?: AgentAction[];
}

export interface AgentAction {
  type: 'search' | 'book' | 'save' | 'fetch_data' | 'user_prompt';
  payload: Record<string, any>;
}

export interface AgentManager {
  handleRequest: (request: AgentRequest) => Promise<AgentResponse>;
  routeToAgent: (role: AgentRole, request: AgentRequest) => Promise<AgentResponse>;
}
