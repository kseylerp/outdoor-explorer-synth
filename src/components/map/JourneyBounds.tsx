
import React, { useEffect } from 'react';
import { LngLatBounds } from 'mapbox-gl';
import { Journey } from '@/types/trips';

interface JourneyBoundsProps {
  map: mapboxgl.Map;
  journey?: Journey;
}

const JourneyBounds: React.FC<JourneyBoundsProps> = ({ map, journey }) => {
  useEffect(() => {
    try {
      if (!journey || !journey.bounds || !journey.bounds.length || !map) {
        return;
      }

      // Validate coordinates before creating bounds
      const validBounds = journey.bounds.every(coord => 
        Array.isArray(coord) && 
        coord.length === 2 &&
        typeof coord[0] === 'number' && 
        typeof coord[1] === 'number' &&
        coord[1] >= -90 && coord[1] <= 90 && // Valid latitude
        coord[0] >= -180 && coord[0] <= 180   // Valid longitude
      );

      if (!validBounds) {
        console.error('Invalid journey bounds:', journey.bounds);
        return;
      }

      // Create bounds and fit the map
      const bounds = new LngLatBounds();
      
      journey.bounds.forEach(coord => {
        bounds.extend([coord[0], coord[1]]);
      });

      map.fitBounds(bounds, {
        padding: 40,
        maxZoom: 14,
        duration: 1000
      });
    } catch (error) {
      console.error('Error setting map bounds:', error);
    }
  }, [map, journey]);

  return null;
};

export default JourneyBounds;
