
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AgentMessage, AgentRequest, AgentResponse, AgentAction } from '@/agents/types';
import { agentManager } from '@/agents/AgentManager';
import { useToast } from '@/hooks/use-toast';

export interface UseAgentConversationProps {
  initialMessages?: AgentMessage[];
  onAction?: (action: AgentAction) => void;
}

export function useAgentConversation({
  initialMessages = [],
  onAction
}: UseAgentConversationProps = {}) {
  const [messages, setMessages] = useState<AgentMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Process agent actions
  const processActions = useCallback((actions: AgentAction[] = []) => {
    if (!actions.length) return;
    
    actions.forEach(action => {
      console.log('Processing action:', action);
      
      // Handle action based on type
      switch (action.type) {
        case 'user_prompt':
          // Show something to the user
          toast({
            title: 'Agent suggestion',
            description: action.payload.message,
          });
          break;
        default:
          // Pass other actions to the handler
          if (onAction) {
            onAction(action);
          }
      }
    });
  }, [toast, onAction]);
  
  // Send a message to the agent system
  const sendMessage = useCallback(async (content: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Create user message
      const userMessage: AgentMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: Date.now()
      };
      
      // Add user message to conversation
      setMessages(prev => [...prev, userMessage]);
      
      // Prepare request with all conversation history
      const request: AgentRequest = {
        messages: [...messages, userMessage]
      };
      
      // Call agent manager
      const response = await agentManager.handleRequest(request);
      
      // Handle agent response
      if (response.message) {
        setMessages(prev => [...prev, response.message]);
        
        if (response.message.agentRole) {
          setActiveAgent(response.message.agentRole);
        }
      }
      
      // Process any actions
      if (response.actions) {
        processActions(response.actions);
      }
      
      return response;
    } catch (err) {
      console.error('Error sending message to agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to communicate with agent');
      
      toast({
        title: 'Communication error',
        description: 'There was a problem talking to the assistant',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, processActions, toast]);
  
  return {
    messages,
    sendMessage,
    isLoading,
    error,
    activeAgent,
    clearMessages: () => setMessages([])
  };
}
