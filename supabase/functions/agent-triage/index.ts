
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { request } = await req.json();
    
    // Get the latest user message
    const userMessage = request.messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (!userMessage) {
      throw new Error('No user message found in the request');
    }
    
    const userInput = userMessage.content.toLowerCase();
    
    // Log the incoming request for debugging
    console.log('Triage agent received:', userInput);
    
    // Simple triage logic based on keywords
    let response;
    
    // Check for search-related queries
    if (
      userInput.includes('find') ||
      userInput.includes('search') ||
      userInput.includes('look for') ||
      userInput.includes('discover') ||
      userInput.includes('recommend')
    ) {
      // Route to search agent
      response = {
        message: {
          id: uuidv4(),
          role: 'agent',
          content: "I'll help you find the perfect adventure! Let me search for some options that match what you're looking for.",
          timestamp: Date.now(),
          agentRole: 'triage'
        },
        handoff: {
          to: 'search',
          reason: 'Query requires search capabilities',
          contextData: {
            query: userInput,
            searchType: 'adventure'
          }
        }
      };
    }
    // Check for account-related queries
    else if (
      userInput.includes('book') ||
      userInput.includes('reserve') ||
      userInput.includes('my account') ||
      userInput.includes('my trip') ||
      userInput.includes('my booking')
    ) {
      // Route to account agent
      response = {
        message: {
          id: uuidv4(),
          role: 'agent',
          content: "I'll help you with your booking or account. Let me get that information for you.",
          timestamp: Date.now(),
          agentRole: 'triage'
        },
        handoff: {
          to: 'account',
          reason: 'Query relates to bookings or account management',
          contextData: {
            intent: userInput.includes('book') ? 'booking' : 'account_info'
          }
        }
      };
    }
    // Default to knowledge agent for informational queries
    else {
      response = {
        message: {
          id: uuidv4(),
          role: 'agent',
          content: "I'd be happy to help answer your questions about outdoor adventures and travel.",
          timestamp: Date.now(),
          agentRole: 'triage'
        },
        handoff: {
          to: 'knowledge',
          reason: 'General informational query',
          contextData: {
            query: userInput
          }
        }
      };
    }
    
    console.log('Triage agent responding:', response);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in triage agent:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'An error occurred in the triage agent'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
