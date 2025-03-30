
import { Trip } from '@/types/trips';
import { supabase } from '@/integrations/supabase/client';

// In-memory cache for trips to avoid unnecessary API calls
const tripCache: Map<string, { trip: Trip, timestamp: number }> = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const cacheTripData = (trip: Trip): void => {
  if (!trip || !trip.id) return;
  
  // Store in-memory
  tripCache.set(trip.id, {
    trip,
    timestamp: Date.now()
  });
  
  // Also persist to Supabase
  saveTripToSupabase(trip).catch(err => 
    console.error('Failed to save trip to Supabase:', err)
  );
};

export const getCachedTrip = (id: string): Trip | null => {
  const cachedData = tripCache.get(id);
  
  if (!cachedData) return null;
  
  // Check if cache is still valid
  if (Date.now() - cachedData.timestamp > CACHE_DURATION) {
    tripCache.delete(id);
    return null;
  }
  
  return cachedData.trip;
};

export const clearTripCache = (): void => {
  tripCache.clear();
};

export const clearTripCacheById = (id: string): void => {
  tripCache.delete(id);
};

// Save trip data to Supabase
const saveTripToSupabase = async (trip: Trip): Promise<void> => {
  try {
    if (!trip || !trip.id) return;
    
    // Prepare data for Supabase (ensuring numeric price)
    const priceEstimate = typeof trip.priceEstimate === 'string' 
      ? parseFloat(trip.priceEstimate) 
      : trip.priceEstimate;
    
    // First check if trip already exists
    const { data: existingTrip } = await supabase
      .from('saved_trips')
      .select('id')
      .eq('trip_id', trip.id)
      .maybeSingle();
      
    if (existingTrip) {
      // Update existing trip
      await supabase
        .from('saved_trips')
        .update({
          title: trip.title,
          description: trip.description,
          location: trip.location,
          duration: trip.duration,
          difficulty_level: trip.difficultyLevel,
          price_estimate: priceEstimate,
          map_center: trip.mapCenter,
          markers: trip.markers,
          journey: trip.journey,
          itinerary: trip.itinerary,
          updated_at: new Date()
        })
        .eq('trip_id', trip.id);
    } else {
      // Insert new trip
      await supabase
        .from('saved_trips')
        .insert({
          trip_id: trip.id,
          title: trip.title,
          description: trip.description,
          location: trip.location,
          duration: trip.duration,
          difficulty_level: trip.difficultyLevel,
          price_estimate: priceEstimate,
          map_center: trip.mapCenter,
          markers: trip.markers,
          journey: trip.journey,
          itinerary: trip.itinerary
        });
    }
    
    console.log(`Trip ${trip.id} saved to Supabase successfully`);
  } catch (error) {
    console.error('Error saving trip to Supabase:', error);
    throw error;
  }
};

// Function to load trip from Supabase if not in cache
export const loadTripFromSupabase = async (id: string): Promise<Trip | null> => {
  try {
    // First try to get from cache
    const cachedTrip = getCachedTrip(id);
    if (cachedTrip) return cachedTrip;
    
    // If not in cache, try to load from Supabase
    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('trip_id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error loading trip from Supabase:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Transform Supabase data to Trip format
    const trip: Trip = {
      id: data.trip_id,
      title: data.title,
      description: data.description || '',
      whyWeChoseThis: '', // Fill in if available
      difficultyLevel: data.difficulty_level || '',
      priceEstimate: data.price_estimate || 0,
      duration: data.duration || '',
      location: data.location || '',
      mapCenter: data.map_center || { lng: 0, lat: 0 },
      markers: data.markers || [],
      journey: data.journey || undefined,
      itinerary: data.itinerary || [],
    };
    
    // Cache the trip we just loaded
    cacheTripData(trip);
    
    return trip;
  } catch (error) {
    console.error('Error in loadTripFromSupabase:', error);
    return null;
  }
};
