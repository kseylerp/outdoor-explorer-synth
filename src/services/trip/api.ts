
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trips';
import { validateAndTransformTrip } from './transformer';
import { toast } from '@/hooks/use-toast';

/**
 * Service responsible for API calls to generate trips
 */

// Function to fetch recommendations from the Claude API with caching
export const generateTrips = async (prompt: string): Promise<Trip[]> => {
  try {
    console.log("Calling trip-recommendations edge function with prompt:", prompt);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('trip-recommendations', {
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
    
    let validatedTrips: Trip[] = [];
    
    // Handle data directly if it's an array of trips
    if (Array.isArray(data)) {
      console.log('Received trip data as array, validating trips');
      validatedTrips = data.map((trip: any) => validateAndTransformTrip(trip));
    }
    // Check if data has a 'trip' property that is an array (Claude API format)
    else if (data.trip && Array.isArray(data.trip)) {
      console.log('Received trip data in trip array format, validating trips');
      validatedTrips = data.trip.map((trip: any) => validateAndTransformTrip(trip));
    }
    // Check if data has a single trip object in a trip property
    else if (data.trip && typeof data.trip === 'object' && !Array.isArray(data.trip)) {
      console.log('Received a single trip object in trip property, validating trip');
      const validatedTrip = validateAndTransformTrip(data.trip);
      validatedTrips = [validatedTrip];
    }
    // If data is a single trip object, wrap it in an array
    else if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      console.log('Received a single trip object, validating trip');
      const validatedTrip = validateAndTransformTrip(data);
      validatedTrips = [validatedTrip];
    } else {
      console.error('Unexpected data format from trip-recommendations:', data);
      throw new Error('Invalid response format from API');
    }
    
    return validatedTrips;
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};
