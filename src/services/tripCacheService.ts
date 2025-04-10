
import { Trip } from '@/types/trips';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { jsonToCoordinates, jsonToMarkers, jsonToJourney, jsonToItinerary } from './trip/tripMappers';

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

// Helper function to convert Trip to database-friendly format
const prepareTripForStorage = (trip: Trip) => {
  return {
    trip_id: trip.id,
    title: trip.title,
    description: trip.description,
    location: trip.location,
    duration: trip.duration,
    difficulty_level: trip.difficultyLevel,
    price_estimate: typeof trip.priceEstimate === 'number' 
      ? trip.priceEstimate 
      : typeof trip.priceEstimate === 'string' && !isNaN(parseFloat(trip.priceEstimate)) 
        ? parseFloat(trip.priceEstimate)
        : 0,
    map_center: trip.mapCenter as unknown as Json,
    markers: trip.markers as unknown as Json,
    journey: trip.journey as unknown as Json,
    itinerary: trip.itinerary as unknown as Json
  };
};

// Save trip data to Supabase
const saveTripToSupabase = async (trip: Trip): Promise<void> => {
  try {
    if (!trip || !trip.id) return;
    
    // Prepare data for Supabase with type conversions
    const tripData = prepareTripForStorage(trip);
    
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
        .update(tripData)
        .eq('trip_id', trip.id);
    } else {
      // Insert new trip
      await supabase
        .from('saved_trips')
        .insert([tripData]);
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
    
    // Transform Supabase data to Trip format using our mapper functions
    const trip: Trip = {
      id: data.trip_id,
      title: data.title,
      description: data.description || '',
      whyWeChoseThis: '', // This field doesn't exist in the database, so we set a default empty string
      difficultyLevel: data.difficulty_level || '',
      priceEstimate: data.price_estimate || 0,
      duration: data.duration || '',
      location: data.location || '',
      mapCenter: jsonToCoordinates(data.map_center),
      markers: jsonToMarkers(data.markers),
      journey: jsonToJourney(data.journey),
      itinerary: jsonToItinerary(data.itinerary),
    };
    
    // Cache the trip we just loaded
    cacheTripData(trip);
    
    return trip;
  } catch (error) {
    console.error('Error in loadTripFromSupabase:', error);
    return null;
  }
};
