
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
    
    const userQuery = userMessage.content;
    const userId = request.userId;
    
    // Log the incoming request
    console.log('Account agent received:', userQuery);
    console.log('User ID:', userId);
    
    // Check if the query is related to booking
    const isBookingQuery = userQuery.toLowerCase().includes('book') || 
                          userQuery.toLowerCase().includes('reserve') ||
                          userQuery.toLowerCase().includes('campground');
    
    if (isBookingQuery) {
      // Handle booking-related requests
      const response = {
        message: {
          id: uuidv4(),
          role: 'agent',
          content: "I'd be happy to help you book a campground or activity. To get started, can you tell me which campground or activity you're interested in, and what dates you're looking at?",
          timestamp: Date.now(),
          agentRole: 'account'
        },
        actions: [
          {
            type: 'user_prompt',
            payload: {
              message: 'Prepare for booking details'
            }
          }
        ]
      };
      
      console.log('Account agent responding:', response);
      
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check if the query is about saved trips
    const isSavedTripsQuery = userQuery.toLowerCase().includes('my trip') || 
                             userQuery.toLowerCase().includes('saved trip') ||
                             userQuery.toLowerCase().includes('my save') ||
                             userQuery.toLowerCase().includes('my account');
    
    if (isSavedTripsQuery) {
      // In a real implementation, we would fetch the user's saved trips from the database
      // For demo purposes, we'll return a mock response
      const response = {
        message: {
          id: uuidv4(),
          role: 'agent',
          content: "I can help you with your saved trips. Would you like to view your saved trips or modify an existing trip?",
          timestamp: Date.now(),
          agentRole: 'account'
        },
        actions: [
          {
            type: 'fetch_data',
            payload: {
              dataType: 'saved_trips',
              userId: userId
            }
          }
        ]
      };
      
      console.log('Account agent responding:', response);
      
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Default response for other account-related queries
    const response = {
      message: {
        id: uuidv4(),
        role: 'agent',
        content: "I'm your account assistant. I can help you with bookings, managing your saved trips, and updating your account preferences. What would you like to do?",
        timestamp: Date.now(),
        agentRole: 'account'
      }
    };
    
    console.log('Account agent responding:', response);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in account agent:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'An error occurred in the account agent'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
