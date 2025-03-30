
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface JourneyBoundsProps {
  map: mapboxgl.Map;
  bounds?: number[][];
}

const JourneyBounds: React.FC<JourneyBoundsProps> = ({ map, bounds }) => {
  useEffect(() => {
    if (!bounds || bounds.length !== 2) return;

    try {
      const mapboxBounds = new mapboxgl.LngLatBounds(
        bounds[0] as [number, number],
        bounds[1] as [number, number]
      );
      
      map.fitBounds(mapboxBounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000
      });
    } catch (error) {
      console.error('Error setting map bounds:', error);
    }
  }, [map, bounds]);

  return null;
};

export default JourneyBounds;
