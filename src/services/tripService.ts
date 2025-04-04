
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trips';

interface ThinkingStep {
  text: string;
  timestamp: string;
}

interface TripResponse {
  tripData: {
    trip: Trip[]
  };
  thinking: ThinkingStep[];
}

export const generateTrips = async (prompt: string, existingTrips?: Trip[]): Promise<{ trips: Trip[], thinking: ThinkingStep[] }> => {
  try {
    console.log("Calling trip-recommendations edge function with prompt:", prompt);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('trip-recommendations', {
      body: JSON.stringify({ 
        prompt, 
        existingTrips: existingTrips ? existingTrips : undefined 
      })
    });
    
    if (error) {
      console.error('Error calling trip-recommendations function:', error);
      throw new Error(`Edge Function Error: ${error.message}`);
    }
    
    if (!data) {
      console.error('Empty response from trip-recommendations');
      throw new Error('Empty response from API');
    }
    
    // If the response contains an error message from the edge function
    if (data.error) {
      console.error('Error response from edge function:', data.error);
      throw new Error(data.error + (data.details ? `: ${data.details}` : ''));
    }
    
    console.log("Received response data:", data);
    
    // Extract trip data and thinking steps
    const response = data as TripResponse;
    const thinkingSteps = response.thinking || [];
    let tripsArray: Trip[] = [];
    
    // Extract the trips array from the response
    if (response.tripData && response.tripData.trip && Array.isArray(response.tripData.trip)) {
      tripsArray = response.tripData.trip;
    } else if (Array.isArray(response.tripData)) {
      tripsArray = response.tripData;
    } else {
      // Handle unexpected format
      console.error('Unexpected data format from trip-recommendations:', data);
      throw new Error('Invalid response format from API');
    }
    
    return { 
      trips: tripsArray,
      thinking: thinkingSteps 
    };
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};
