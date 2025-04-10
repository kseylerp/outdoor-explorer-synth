
import { v4 as uuidv4 } from 'uuid';
import { AgentManager, AgentRequest, AgentResponse, AgentRole, AgentMessage } from './types';
import { supabase } from '@/integrations/supabase/client';

class AgentManagerService implements AgentManager {
  
  async handleRequest(request: AgentRequest): Promise<AgentResponse> {
    // If this is the first message, route to triage agent
    if (request.messages.length === 1 && request.messages[0].role === 'user') {
      return this.routeToAgent('triage', request);
    }
    
    // Check the last message for handoff instructions
    const lastAgentMessage = [...request.messages]
      .reverse()
      .find(msg => msg.role === 'agent' && msg.metadata?.handoff);
      
    if (lastAgentMessage?.metadata?.handoff) {
      return this.routeToAgent(
        lastAgentMessage.metadata.handoff.to, 
        {
          ...request,
          context: {
            ...request.context,
            ...lastAgentMessage.metadata.handoff.contextData
          }
        }
      );
    }
    
    // Default to the last agent that responded
    const lastAgent = [...request.messages]
      .reverse()
      .find(msg => msg.role === 'agent' && msg.agentRole)?.agentRole;
    
    return this.routeToAgent(lastAgent || 'triage', request);
  }
  
  async routeToAgent(role: AgentRole, request: AgentRequest): Promise<AgentResponse> {
    console.log(`Routing request to ${role} agent`);
    
    let response: AgentResponse;
    
    try {
      switch (role) {
        case 'triage':
          response = await this.callTriageAgent(request);
          break;
        case 'search':
          response = await this.callSearchAgent(request);
          break;
        case 'knowledge':
          response = await this.callKnowledgeAgent(request);
          break;
        case 'account':
          response = await this.callAccountAgent(request);
          break;
        default:
          throw new Error(`Unknown agent role: ${role}`);
      }
      
      // Add agent role to response message
      response.message.agentRole = role;
      
      return response;
    } catch (error) {
      console.error(`Error with ${role} agent:`, error);
      
      // Return graceful error response
      return {
        message: {
          id: uuidv4(),
          role: 'agent',
          content: `I'm sorry, but I encountered an issue with the ${role} agent. Let me try a different approach.`,
          timestamp: Date.now(),
          agentRole: role
        },
        // Fall back to knowledge agent on error
        handoff: {
          to: 'knowledge',
          reason: 'Error in agent processing'
        }
      };
    }
  }
  
  private async callTriageAgent(request: AgentRequest): Promise<AgentResponse> {
    // Call the triage agent via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('agent-triage', {
      body: { request }
    });
    
    if (error) throw new Error(`Triage agent error: ${error.message}`);
    return data;
  }
  
  private async callSearchAgent(request: AgentRequest): Promise<AgentResponse> {
    // Call the search agent via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('agent-search', {
      body: { request }
    });
    
    if (error) throw new Error(`Search agent error: ${error.message}`);
    return data;
  }
  
  private async callKnowledgeAgent(request: AgentRequest): Promise<AgentResponse> {
    // Call the knowledge agent via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('agent-knowledge', {
      body: { request }
    });
    
    if (error) throw new Error(`Knowledge agent error: ${error.message}`);
    return data;
  }
  
  private async callAccountAgent(request: AgentRequest): Promise<AgentResponse> {
    // Call the account agent via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('agent-account', {
      body: { request }
    });
    
    if (error) throw new Error(`Account agent error: ${error.message}`);
    return data;
  }
}

// Export singleton instance
export const agentManager = new AgentManagerService();
