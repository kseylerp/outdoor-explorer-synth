
import { Trip } from '@/types/trips';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch recommendations from the Claude API
export const generateTrips = async (prompt: string): Promise<Trip[]> => {
  try {
    console.log("Calling trip-recommendations edge function with prompt:", prompt);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('trip-recommendations', {
      body: { prompt }
    });
    
    if (error) {
      console.error('Error calling trip-recommendations function:', error);
      throw error;
    }
    
    if (!data || !data.trips || !Array.isArray(data.trips)) {
      console.error('Invalid response format from trip-recommendations:', data);
      throw new Error('Invalid response format from API');
    }
    
    console.log('Received trip data:', data.trips);
    return data.trips;
  } catch (error) {
    console.error('Error generating trips:', error);
    throw error;
  }
};

// Function to fetch guides from Supabase
export const fetchGuides = async () => {
  try {
    const { data, error } = await supabase
      .from('guide_services')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
};

// Function to fetch activities from Supabase
export const fetchActivities = async () => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
