
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Segment } from '@/types/trips';
import { addPopupStyles, removePopupStyles } from '../utils/popup-utils';
import JourneyBounds from '../JourneyBounds';
import RouteSegments from './RouteSegments';
import WaypointMarkers from './WaypointMarkers';

interface RouteLayerProps {
  map: mapboxgl.Map | null;
  journey?: {
    segments: Segment[];
    totalDistance: number;
    totalDuration: number;
    bounds?: number[][];
  };
  isLoading?: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ map, journey, isLoading = false }) => {
  // Add popup styles on mount, remove on unmount
  useEffect(() => {
    if (!map || !journey || !journey.segments || journey.segments.length === 0) {
      return;
    }

    // Add popup styles
    addPopupStyles();
    
    // Cleanup function
    return () => {
      removePopupStyles();
    };
  }, [map, journey]);

  if (!map || !journey || !journey.segments || journey.segments.length === 0) {
    return null;
  }

  // Don't render segments while loading
  if (isLoading) {
    return (
      <JourneyBounds 
        map={map} 
        bounds={journey.bounds} 
      />
    );
  }

  return (
    <>
      <RouteSegments 
        map={map} 
        segments={journey.segments} 
      />
      
      <WaypointMarkers 
        map={map} 
        segments={journey.segments} 
      />
      
      <JourneyBounds 
        map={map} 
        bounds={journey.bounds} 
      />
    </>
  );
};

export default RouteLayer;
