
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trips';
import { validateAndTransformTrip } from './transformer';
import { fetchGuides, fetchActivities } from './dataService';
import { 
  cacheTripData, 
  getCachedTrip, 
  loadTripFromSupabase 
} from '../tripCacheService';
import { toast } from '@/hooks/use-toast';

// Function to fetch a single trip by ID with caching
export const fetchTripById = async (id: string): Promise<Trip | null> => {
  try {
    console.log(`Fetching trip with ID: ${id}`);
    
    // First try to get from cache
    const cachedTrip = getCachedTrip(id);
    if (cachedTrip) {
      console.log(`Trip (ID: ${id}) found in cache`);
      return cachedTrip;
    }
    
    // If not in cache, try to load from Supabase
    const supabaseTrip = await loadTripFromSupabase(id);
    if (supabaseTrip) {
      console.log(`Trip (ID: ${id}) loaded from Supabase`);
      return supabaseTrip;
    }
    
    // If not in cache or database, return null
    console.log(`Trip (ID: ${id}) not found`);
    return null;
  } catch (error) {
    console.error(`Error fetching trip (ID: ${id}):`, error);
    toast({
      title: "Error",
      description: "Failed to load trip details. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

// Interface for the Claude API response
interface ClaudeResponse {
  thinking?: string[] | null;
  tripData?: {
    trip: Trip[];
  } | null;
}

// Function to fetch recommendations from the Claude API with caching
export const generateTrips = async (prompt: string): Promise<{trips: Trip[], thinking?: string[]}> => {
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
    
    const claudeResponse = data as ClaudeResponse;
    let validatedTrips: Trip[] = [];
    let thinking = claudeResponse.thinking;
    
    // Handle trip data from the response
    if (claudeResponse.tripData && claudeResponse.tripData.trip) {
      console.log('Received trip data, validating trips');
      validatedTrips = claudeResponse.tripData.trip.map((trip: any) => validateAndTransformTrip(trip));
    } else if (Array.isArray(data)) {
      console.log('Received trip data as array, validating trips');
      validatedTrips = data.map((trip: any) => validateAndTransformTrip(trip));
    } else if (data.trip && Array.isArray(data.trip)) {
      console.log('Received trip data in trip array format, validating trips');
      validatedTrips = data.trip.map((trip: any) => validateAndTransformTrip(trip));
    } else {
      console.error('Unexpected data format from trip-recommendations:', data);
      throw new Error('Invalid response format from API');
    }
    
    // Cache each validated trip
    validatedTrips.forEach(trip => {
      if (trip && trip.id) {
        cacheTripData(trip);
      }
    });
    
    return { trips: validatedTrips, thinking };
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};

// Export other functions from the service
export { fetchGuides, fetchActivities };
