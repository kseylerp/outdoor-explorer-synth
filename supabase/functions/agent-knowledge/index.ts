
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
    
    // Log the incoming request
    console.log('Knowledge agent received:', userQuery);
    
    // In a real implementation, we would use a large language model (like OpenAI's APIs)
    // For now, let's implement a simple response generator based on keywords
    
    // Sample responses for different types of queries
    const responses = {
      hiking: "Hiking is a wonderful way to connect with nature. When planning a hiking trip, consider factors like trail difficulty, distance, elevation gain, and the time of year. Always bring enough water, appropriate footwear, and let someone know your itinerary.",
      camping: "Camping is a great adventure experience. The key to a successful camping trip is preparation - bring appropriate gear for the weather, research your campsite facilities, and know the local wildlife safety protocols.",
      national_parks: "National Parks offer some of the most stunning landscapes and outdoor experiences. Most parks require entrance fees, and popular campgrounds often need reservations months in advance, especially during peak season.",
      gear: "The right gear can make or break an outdoor adventure. Essential items include appropriate clothing layers, navigation tools, first aid kit, sufficient water, and emergency supplies.",
      safety: "Outdoor safety is paramount. Always check weather conditions before heading out, bring navigation tools, tell someone your itinerary, and be prepared for emergencies with first aid supplies and extra food/water.",
      weather: "Weather conditions can change rapidly in outdoor settings, especially in mountainous areas. Check forecasts before your trip, but also be prepared for unexpected changes.",
      default: "That's a great question about outdoor adventures. The key to any successful outdoor experience is preparation, respect for nature, and safety awareness."
    };
    
    // Simple keyword matching to determine the response
    let responseContent = responses.default;
    
    const lowerQuery = userQuery.toLowerCase();
    if (lowerQuery.includes('hik') || lowerQuery.includes('trail')) {
      responseContent = responses.hiking;
    } else if (lowerQuery.includes('camp') || lowerQuery.includes('tent')) {
      responseContent = responses.camping;
    } else if (lowerQuery.includes('national park') || lowerQuery.includes('state park')) {
      responseContent = responses.national_parks;
    } else if (lowerQuery.includes('gear') || lowerQuery.includes('equipment') || lowerQuery.includes('bring')) {
      responseContent = responses.gear;
    } else if (lowerQuery.includes('safe') || lowerQuery.includes('danger')) {
      responseContent = responses.safety;
    } else if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature')) {
      responseContent = responses.weather;
    }
    
    // Return knowledge response
    const response = {
      message: {
        id: uuidv4(),
        role: 'agent',
        content: responseContent,
        timestamp: Date.now(),
        agentRole: 'knowledge'
      }
    };
    
    console.log('Knowledge agent responding:', response);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in knowledge agent:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'An error occurred in the knowledge agent'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
