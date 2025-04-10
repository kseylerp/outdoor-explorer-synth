
import { Trip } from '@/types/trips';

// In-memory cache configuration
const tripCache: Map<string, { trip: Trip, timestamp: number }> = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Stores a trip in the in-memory cache
 */
export const addToCache = (trip: Trip): void => {
  if (!trip || !trip.id) return;
  
  tripCache.set(trip.id, {
    trip,
    timestamp: Date.now()
  });
};

/**
 * Retrieves a trip from the in-memory cache if it exists and is not expired
 */
export const getFromCache = (id: string): Trip | null => {
  const cachedData = tripCache.get(id);
  
  if (!cachedData) return null;
  
  // Check if cache is still valid
  if (Date.now() - cachedData.timestamp > CACHE_DURATION) {
    tripCache.delete(id);
    return null;
  }
  
  return cachedData.trip;
};

/**
 * Clears the entire in-memory cache
 */
export const clearCache = (): void => {
  tripCache.clear();
};

/**
 * Removes a specific trip from the in-memory cache
 */
export const removeFromCache = (id: string): void => {
  tripCache.delete(id);
};
