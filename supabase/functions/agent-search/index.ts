
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to extract search terms
function extractSearchTerms(text: string): Record<string, any> {
  const terms: Record<string, any> = {
    location: null,
    activity: null,
    duration: null,
    difficulty: null,
  };
  
  // Location extraction
  const locationPatterns = [
    /(?:in|near|around|at)\s+([A-Za-z\s]+?(?:Park|Mountain|Forest|Lake|River|Valley|Canyon|Trail|Beach|Coast|Island))/i,
    /(?:to|in|near|around)\s+([A-Za-z\s]+?(?:National|State|Provincial)(?:\s+Park)?)/i,
    /(?:in|to|near|around)\s+([A-Za-z\s]+?)(?:,|\s+for|\s+with|\s+and|\s+to|\s+\.|$)/i
  ];
  
  // Try each pattern until we find a match
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      terms.location = match[1].trim();
      break;
    }
  }
  
  // Activity extraction
  const activityList = [
    'hiking', 'camping', 'backpacking', 'climbing', 'kayaking', 
    'canoeing', 'rafting', 'fishing', 'skiing', 'snowboarding',
    'snowshoeing', 'biking', 'mountain biking', 'bird watching',
    'wildlife viewing', 'photography', 'stargazing'
  ];
  
  for (const activity of activityList) {
    if (text.toLowerCase().includes(activity)) {
      terms.activity = activity;
      break;
    }
  }
  
  // Duration extraction
  const durationMatch = text.match(/(\d+)(?:\s+|-|_)?(day|week)s?/i);
  if (durationMatch) {
    terms.duration = {
      value: parseInt(durationMatch[1]),
      unit: durationMatch[2].toLowerCase()
    };
  }
  
  // Difficulty extraction
  const difficultyTerms = {
    easy: ['easy', 'beginner', 'simple', 'gentle', 'mild'],
    moderate: ['moderate', 'intermediate', 'medium'],
    difficult: ['difficult', 'hard', 'challenging', 'strenuous', 'tough', 'advanced']
  };
  
  for (const [level, terms] of Object.entries(difficultyTerms)) {
    for (const term of terms) {
      if (text.toLowerCase().includes(term)) {
        terms.difficulty = level;
        break;
      }
    }
    if (terms.difficulty) break;
  }
  
  return terms;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { request } = await req.json();
    
    // Extract the search context
    const context = request.context || {};
    
    // Get the latest user message
    const userMessage = request.messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (!userMessage) {
      throw new Error('No user message found in the request');
    }
    
    const userQuery = userMessage.content;
    
    // Log the incoming request
    console.log('Search agent received:', userQuery);
    
    // Extract search terms from the query
    const searchTerms = extractSearchTerms(userQuery);
    console.log('Extracted search terms:', searchTerms);
    
    // In a real implementation, we'd search a database or call an API here
    // For now, we'll simulate a search response with sample data
    
    // Simple logic to determine if we should return results or pass to knowledge agent
    const hasSearchTerms = Object.values(searchTerms).some(val => val !== null);
    
    if (!hasSearchTerms) {
      // Not enough search terms, pass to knowledge agent
      return new Response(JSON.stringify({
        message: {
          id: uuidv4(),
          role: 'agent',
          content: "I'm not finding specific places or activities in your request. Let me pass you to our knowledge agent who can help with general adventure information.",
          timestamp: Date.now(),
          agentRole: 'search'
        },
        handoff: {
          to: 'knowledge',
          reason: 'Insufficient search parameters',
          contextData: {
            query: userQuery
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Generate a sample response based on extracted terms
    let responseContent = "I've found some adventure options based on your request:\n\n";
    
    if (searchTerms.location) {
      responseContent += `For ${searchTerms.location}, I found several great options. `;
    }
    
    if (searchTerms.activity) {
      responseContent += `The ${searchTerms.activity} opportunities are excellent. `;
    }
    
    responseContent += "Would you like me to show you the top recommendations?";
    
    // Return search results with action for trip generation
    const response = {
      message: {
        id: uuidv4(),
        role: 'agent',
        content: responseContent,
        timestamp: Date.now(),
        agentRole: 'search'
      },
      actions: [
        {
          type: 'search',
          payload: {
            searchTerms,
            query: userQuery
          }
        }
      ]
    };
    
    console.log('Search agent responding:', response);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search agent:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'An error occurred in the search agent'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
