
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setLoading(true);
        // Try to get the token from Supabase Function Secrets
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          // Fallback to the hardcoded token if there's an error
          setMapboxToken('pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY21zbjd1eWRmMHF0azJybnNsN2RxdGYwOCJ9.h_LpGv5W13OT59tQiAopcA');
        } else if (data?.token) {
          setMapboxToken(data.token);
        } else {
          // Fallback to the hardcoded token if no data
          setMapboxToken('pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY21zbjd1eWRmMHF0azJybnNsN2RxdGYwOCJ9.h_LpGv5W13OT59tQiAopcA');
        }
        setError(null);
      } catch (err) {
        console.error('Exception fetching Mapbox token:', err);
        // Fallback to the hardcoded token if there's an exception
        setMapboxToken('pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY21zbjd1eWRmMHF0azJybnNsN2RxdGYwOCJ9.h_LpGv5W13OT59tQiAopcA');
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  return { mapboxToken, loading, error };
};
