
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trips';
import { validateAndTransformTrip } from './transformer';
import { fetchGuides, fetchActivities } from './dataService';

// Function to fetch recommendations from the Claude API
export const generateTrips = async (prompt: string): Promise<Trip[]> => {
  try {
    console.log("Calling trip-recommendations edge function with prompt:", prompt);
    
    // Call the Supabase Edge Function
    const { data, error, status } = await supabase.functions.invoke('trip-recommendations', {
      body: JSON.stringify({ prompt })
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
    
    // If data is already in the expected format with a trips array
    if (data.trips && Array.isArray(data.trips)) {
      console.log('Received trip data in correct format:', data.trips.length, 'trips');
      
      // Validate each trip has required fields
      const validatedTrips = data.trips.map((trip: any) => validateAndTransformTrip(trip));
      return validatedTrips;
    }
    
    // If data is an array but not wrapped in a trips object
    if (Array.isArray(data)) {
      console.log('Received trip data as array, transforming to correct format');
      
      // Validate each trip has required fields
      const validatedTrips = data.map((trip: any) => validateAndTransformTrip(trip));
      return validatedTrips;
    }
    
    console.error('Invalid response format from trip-recommendations:', data);
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};

// Export other functions from dataService
export { fetchGuides, fetchActivities };
