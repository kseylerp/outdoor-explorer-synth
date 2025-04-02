
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MarkerLayer from './MarkerLayer';
import RouteLayer from './RouteLayer';
import { Journey, Segment } from '@/types/trips';
import { MapMarker } from './types';
import { toast } from '@/hooks/use-toast';
import { processJourneyWithDirections } from '@/services/mapboxService';

interface MapContentProps {
  map: mapboxgl.Map;
  markers?: MapMarker[];
  journey?: Journey;
  routeType?: string;
}

const MapContent: React.FC<MapContentProps> = ({ map, markers = [], journey, routeType = 'all' }) => {
  const [processedJourney, setProcessedJourney] = useState<Journey | undefined>(journey);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Validate markers are properly formed before rendering
  const validMarkers = Array.isArray(markers) ? markers.filter(marker => 
    marker && marker.coordinates && 
    typeof marker.coordinates.lng === 'number' && 
    typeof marker.coordinates.lat === 'number'
  ) : [];
  
  // Process routes with real Mapbox directions when journey exists
  useEffect(() => {
    if (!journey || !journey.segments || journey.segments.length === 0) {
      setProcessedJourney(undefined);
      return;
    }
    
    const enhanceJourney = async () => {
      try {
        setIsProcessing(true);
        
        // Check if we need to process the journey
        const needsProcessing = journey.segments.some(segment => 
          !segment.geometry?.coordinates || 
          segment.geometry.coordinates.length < 5
        );
        
        if (needsProcessing) {
          console.log('Processing journey with Mapbox Directions API');
          // Use our new helper function to process the entire journey
          const enhanced = await processJourneyWithDirections(journey);
          setProcessedJourney(enhanced);
        } else {
          setProcessedJourney(journey);
        }
      } catch (error) {
        console.error('Error enhancing journey:', error);
        setProcessedJourney(journey); // Fall back to original journey
      } finally {
        setIsProcessing(false);
      }
    };
    
    enhanceJourney();
  }, [journey]);
  
  // Filter segments by route type if specified
  const filteredJourney = processedJourney && routeType !== 'all' 
    ? {
        ...processedJourney,
        segments: processedJourney.segments.filter(segment => {
          // Map the route type to segment mode
          switch(routeType) {
            case 'walk':
              return segment.mode === 'walking' || segment.mode === 'hiking';
            case 'bike':
              return segment.mode === 'cycling';
            case 'drive':
              return segment.mode === 'driving';
            case 'transit':
              return segment.mode === 'transit';
            default:
              return true;
          }
        })
      }
    : processedJourney;
  
  // Notify if filtered journey has no segments
  useEffect(() => {
    if (processedJourney && 
        routeType !== 'all' && 
        filteredJourney?.segments.length === 0) {
      toast({
        title: "No routes available",
        description: `No ${routeType} routes found for this trip.`,
        variant: "default"
      });
    }
  }, [filteredJourney, processedJourney, routeType]);
  
  return (
    <>
      {validMarkers.length > 0 && (
        <MarkerLayer map={map} markers={validMarkers} />
      )}
      
      {filteredJourney && filteredJourney.segments.length > 0 && (
        <RouteLayer 
          map={map} 
          journey={filteredJourney} 
          isLoading={isProcessing}
        />
      )}
    </>
  );
};

export default MapContent;
