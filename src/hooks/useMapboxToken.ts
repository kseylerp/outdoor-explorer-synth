
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setLoading(true);
        // Try to get the token from Supabase Function
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          throw new Error('Failed to fetch Mapbox token');
        }
        
        if (data?.token) {
          // Verify token starts with 'pk.' for public token
          if (!data.token.startsWith('pk.')) {
            console.error('Invalid Mapbox token format - must be a public token (pk.*)');
            throw new Error('Invalid Mapbox token format - must be a public token (pk.*)');
          }
          
          setMapboxToken(data.token);
          console.log('Successfully obtained public Mapbox token');
        } else {
          throw new Error('No token returned from server');
        }
        
        setError(null);
      } catch (err) {
        console.error('Exception fetching Mapbox token:', err);
        
        // Show error toast
        toast({
          title: 'Map loading error',
          description: 'Unable to load map data. Please try again later.',
          variant: 'destructive'
        });
        
        setError(err as Error);
        
        // Use fallback only if it's a valid public token format (starting with pk.)
        const fallbackToken = 'pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY21zbjd1eWRmMHF0azJybnNsN2RxdGYwOCJ9.h_LpGv5W13OT59tQiAopcA';
        if (fallbackToken.startsWith('pk.')) {
          setMapboxToken(fallbackToken);
          console.log('Using fallback public Mapbox token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  return { mapboxToken, loading, error };
};
