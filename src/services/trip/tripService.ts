
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trips';
import { validateAndTransformTrip } from './transformer';
import { fetchGuides, fetchActivities } from './dataService';

// Function to fetch recommendations from the Claude API
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
    
    console.log("Received data structure from edge function:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Log the data structure to help with debugging
    if (data.trip) {
      console.log("Data contains 'trip' property:", Array.isArray(data.trip) ? "Array" : typeof data.trip);
    } else if (Array.isArray(data)) {
      console.log("Data is an array of length:", data.length);
    } else {
      console.log("Data type:", typeof data);
      if (typeof data === 'object') {
        console.log("Object keys:", Object.keys(data));
      }
    }
    
    // Handle data directly if it's an array of trips
    if (Array.isArray(data)) {
      console.log('Received trip data as array, validating trips');
      const validatedTrips = data.map((trip: any) => validateAndTransformTrip(trip));
      return validatedTrips;
    }
    
    // Check if data has a 'trip' property that is an array (Claude API format)
    if (data.trip && Array.isArray(data.trip)) {
      console.log('Received trip data in trip array format, validating trips');
      const validatedTrips = data.trip.map((trip: any) => validateAndTransformTrip(trip));
      return validatedTrips;
    }
    
    // Check if data has a single trip object in a trip property
    if (data.trip && typeof data.trip === 'object' && !Array.isArray(data.trip)) {
      console.log('Received a single trip object in trip property, validating trip');
      const validatedTrip = validateAndTransformTrip(data.trip);
      return [validatedTrip];
    }
    
    // If data is a single trip object, wrap it in an array
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      console.log('Received a single trip object, validating trip');
      const validatedTrip = validateAndTransformTrip(data);
      return [validatedTrip];
    }
    
    console.error('Unexpected data format from trip-recommendations:', data);
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};

// Export other functions from dataService
export { fetchGuides, fetchActivities };
