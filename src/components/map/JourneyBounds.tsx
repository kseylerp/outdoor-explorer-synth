
import React, { useEffect } from 'react';
import { LngLatBounds } from 'mapbox-gl';
import { Journey } from '@/types/trips';

interface JourneyBoundsProps {
  map: mapboxgl.Map;
  journey?: Journey;
}

const JourneyBounds: React.FC<JourneyBoundsProps> = ({ map, journey }) => {
  useEffect(() => {
    if (!map || !journey) {
      console.log("Missing map or journey data for setting bounds");
      return;
    }

    try {
      // Check if we have valid bounds
      if (journey.bounds && Array.isArray(journey.bounds) && journey.bounds.length > 1) {
        // Validate coordinates before creating bounds
        const validBounds = journey.bounds.every(coord => 
          Array.isArray(coord) && 
          coord.length === 2 &&
          typeof coord[0] === 'number' && 
          typeof coord[1] === 'number' &&
          coord[1] >= -90 && coord[1] <= 90 && // Valid latitude
          coord[0] >= -180 && coord[0] <= 180   // Valid longitude
        );

        if (validBounds) {
          console.log("Setting map bounds from journey.bounds");
          const bounds = new LngLatBounds();
          journey.bounds.forEach(coord => {
            bounds.extend([coord[0], coord[1]]);
          });

          map.fitBounds(bounds, {
            padding: 40,
            maxZoom: 14,
            duration: 1000
          });
          return;
        } else {
          console.warn('Invalid journey bounds:', journey.bounds);
        }
      } else {
        console.log("No valid bounds array in journey, trying to create from segments");
      }
      
      // Fallback: Try to create bounds from segment coordinates
      if (journey.segments && journey.segments.length > 0) {
        const bounds = new LngLatBounds();
        let boundsAdded = false;
        
        // Try to extract bounds from segment coordinates
        journey.segments.forEach(segment => {
          if (segment.geometry && Array.isArray(segment.geometry.coordinates)) {
            segment.geometry.coordinates.forEach(coord => {
              if (Array.isArray(coord) && coord.length >= 2) {
                bounds.extend([coord[0], coord[1]]);
                boundsAdded = true;
              }
            });
          }
        });
        
        if (boundsAdded) {
          console.log("Created bounds from segment coordinates");
          map.fitBounds(bounds, {
            padding: 40,
            maxZoom: 14,
            duration: 1000
          });
        } else {
          console.warn("Could not create bounds from segments");
        }
      }
    } catch (error) {
      console.error('Error setting map bounds:', error);
    }
  }, [map, journey]);

  return null;
};

export default JourneyBounds;
