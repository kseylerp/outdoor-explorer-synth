
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';

interface ClaudeResponse {
  trips: Trip[];
}

export const fetchTripRecommendations = async (prompt: string): Promise<Trip[]> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('trip-recommendations', {
      body: { prompt },
    });

    if (error) {
      console.error('Error fetching trip recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch trip recommendations. Please try again.',
        variant: 'destructive',
      });
      throw new Error('Failed to fetch trip recommendations');
    }

    // The response should match our ClaudeResponse interface with trips array
    const response = data as ClaudeResponse;
    
    if (!response.trips || !Array.isArray(response.trips)) {
      toast({
        title: 'Invalid Response',
        description: 'Received invalid data format from the AI. Please try again.',
        variant: 'destructive',
      });
      throw new Error('Invalid response format');
    }

    // Process price estimate to convert from number to string format if needed
    const processedTrips = response.trips.map(trip => {
      // If priceEstimate is a number, convert it to string format
      if (typeof trip.priceEstimate === 'number') {
        // Convert price to "$" format based on value range
        let priceString: string;
        const price = Number(trip.priceEstimate);
        
        if (price < 500) priceString = "$";
        else if (price < 1000) priceString = "$$";
        else if (price < 2000) priceString = "$$$";
        else priceString = "$$$$";
        
        return {
          ...trip,
          priceEstimate: priceString
        };
      }
      return trip;
    });

    return processedTrips;
  } catch (error) {
    console.error('Error in fetchTripRecommendations:', error);
    throw error;
  }
};
