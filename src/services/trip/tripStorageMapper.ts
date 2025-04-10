
import { Trip } from '@/types/trips';
import { Json } from '@/integrations/supabase/types';

/**
 * Convert Trip object to database-friendly format for storage
 */
export const tripToStorageFormat = (trip: Trip) => {
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
