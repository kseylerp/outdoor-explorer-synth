
import { Trip } from '@/types/trips';
import { validateAndTransformTrip } from './transformer';
import { fetchGuides, fetchActivities } from './dataService';
import { 
  cacheTripData, 
  getCachedTrip, 
  loadTripFromSupabase 
} from '../tripCacheService';
import { toast } from '@/hooks/use-toast';
import { getMockTripById } from './mockData';
import { generateTrips } from './api';

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
    
    // If not in Supabase, fetch from API
    console.log(`Trip (ID: ${id}) not found in cache or Supabase, fetching from API`);
    
    // For demo purposes, fetch from mock data
    // In a real app, this would be an API call
    const trip = getMockTripById(id) || null;
    
    if (trip) {
      // Validate and transform the trip data
      const validatedTrip = validateAndTransformTrip(trip);
      
      // Cache the trip data for future use
      cacheTripData(validatedTrip);
      
      return validatedTrip;
    }
    
    console.warn(`Trip with ID ${id} not found`);
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

// Export other functions from the service
export { generateTrips, fetchGuides, fetchActivities };
