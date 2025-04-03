
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TripBuddy {
  id: string;
  trip_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: 'pending' | 'confirmed' | 'declined';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuddyInvite {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export const fetchTripBuddies = async (tripId: string): Promise<TripBuddy[]> => {
  try {
    const { data, error } = await supabase
      .from('trip_buddies')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trip buddies:', error);
    toast({
      title: 'Error',
      description: 'Failed to load trip buddies',
      variant: 'destructive'
    });
    return [];
  }
};

export const addBuddy = async (tripId: string, buddy: BuddyInvite): Promise<TripBuddy | null> => {
  try {
    const { data, error } = await supabase
      .from('trip_buddies')
      .insert({
        trip_id: tripId,
        name: buddy.name,
        email: buddy.email || null,
        phone: buddy.phone || null,
        notes: buddy.notes || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: `${buddy.name} was added to the trip`,
      variant: 'default'
    });
    
    return data;
  } catch (error) {
    console.error('Error adding buddy:', error);
    toast({
      title: 'Error',
      description: 'Failed to add buddy to trip',
      variant: 'destructive'
    });
    return null;
  }
};

export const removeBuddy = async (buddyId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('trip_buddies')
      .delete()
      .eq('id', buddyId);
    
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Buddy removed from trip',
      variant: 'default'
    });
    
    return true;
  } catch (error) {
    console.error('Error removing buddy:', error);
    toast({
      title: 'Error',
      description: 'Failed to remove buddy',
      variant: 'destructive'
    });
    return false;
  }
};

export const updateBuddyStatus = async (buddyId: string, status: 'pending' | 'confirmed' | 'declined'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('trip_buddies')
      .update({ status })
      .eq('id', buddyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating buddy status:', error);
    return false;
  }
};

export const updateBuddyNotes = async (buddyId: string, notes: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('trip_buddies')
      .update({ notes })
      .eq('id', buddyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating buddy notes:', error);
    return false;
  }
};
