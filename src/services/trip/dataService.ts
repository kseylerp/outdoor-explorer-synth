
import { supabase } from '@/integrations/supabase/client';

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
