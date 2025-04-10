
import { Trip } from '@/types/trips';
import { addToCache, getFromCache, clearCache, removeFromCache } from './tripCacheManager';
import { saveToDatabase, loadFromDatabase } from './tripPersistence';

/**
 * Main facade service for trip caching operations
 * Coordinates between in-memory cache and database persistence
 */
export const cacheTripData = (trip: Trip): void => {
  if (!trip || !trip.id) return;
  
  // Store in-memory
  addToCache(trip);
  
  // Also persist to Supabase
  saveToDatabase(trip).catch(err => 
    console.error('Failed to save trip to Supabase:', err)
  );
};

export const getCachedTrip = (id: string): Trip | null => {
  return getFromCache(id);
};

export const clearTripCache = (): void => {
  clearCache();
};

export const clearTripCacheById = (id: string): void => {
  removeFromCache(id);
};

/**
 * Function to load trip from Supabase if not in cache
 */
export const loadTripFromSupabase = async (id: string): Promise<Trip | null> => {
  try {
    // First try to get from cache
    const cachedTrip = getCachedTrip(id);
    if (cachedTrip) return cachedTrip;
    
    // If not in cache, try to load from Supabase
    const trip = await loadFromDatabase(id);
    
    // Cache the trip we just loaded if it exists
    if (trip) {
      cacheTripData(trip);
    }
    
    return trip;
  } catch (error) {
    console.error('Error in loadTripFromSupabase:', error);
    return null;
  }
};
