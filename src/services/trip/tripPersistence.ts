
import { supabase } from "@/integrations/supabase/client";
import { Trip } from '@/types/trips';
import { Json } from '@/integrations/supabase/types';
import { tripToStorageFormat } from './tripStorageMapper';
import { jsonToCoordinates, jsonToMarkers, jsonToJourney, jsonToItinerary } from './tripMappers';

/**
 * Saves a trip to the Supabase database
 */
export const saveToDatabase = async (trip: Trip): Promise<void> => {
  try {
    if (!trip || !trip.id) return;
    
    // Prepare data for Supabase with type conversions
    const tripData = tripToStorageFormat(trip);
    
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

/**
 * Loads a trip from the Supabase database
 */
export const loadFromDatabase = async (id: string): Promise<Trip | null> => {
  try {
    // Try to load from Supabase
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
    
    return trip;
  } catch (error) {
    console.error('Error in loadFromDatabase:', error);
    return null;
  }
};
