
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Coordinates {
  lng: number;
  lat: number;
}

interface Step {
  maneuver: {
    instruction: string;
    location: number[];
  };
  distance: number;
  duration: number;
}

interface Segment {
  mode: string;
  from: string;
  to: string;
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
  };
  steps: Step[];
}

interface Journey {
  segments: Segment[];
  totalDistance: number;
  totalDuration: number;
  bounds: number[][];
}

interface MapDisplayProps {
  journey?: Journey;
  markers?: Array<{
    name: string;
    coordinates: Coordinates;
    description?: string;
  }>;
  center?: Coordinates;
  interactive?: boolean;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  journey,
  markers = [],
  center = { lng: -122.4194, lat: 37.7749 }, // Default to San Francisco
  interactive = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch Mapbox token from Supabase
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
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
      } catch (err) {
        console.error('Exception fetching Mapbox token:', err);
        // Fallback to the hardcoded token if there's an exception
        setMapboxToken('pk.eyJ1Ijoia3NleWxlcnAiLCJhIjoiY21zbjd1eWRmMHF0azJybnNsN2RxdGYwOCJ9.h_LpGv5W13OT59tQiAopcA');
      }
    };

    fetchMapboxToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/kseylerp/cm8i0dbtn015s01sq8v5fh0xn',
      center: [center.lng, center.lat],
      zoom: 9,
      interactive: interactive
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, interactive, mapboxToken]);

  // Add markers and routes when map is loaded and journey data changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear previous markers and routes
    const mapElem = map.current;
    
    // Remove all existing markers
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => {
      marker.remove();
    });

    // Remove previous routes
    if (mapElem.getLayer('route-driving')) mapElem.removeLayer('route-driving');
    if (mapElem.getLayer('route-walking')) mapElem.removeLayer('route-walking');
    if (mapElem.getLayer('route-cycling')) mapElem.removeLayer('route-cycling');
    if (mapElem.getSource('route-source')) mapElem.removeSource('route-source');

    // Add markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#4A7B9D';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${marker.name}</h3>${marker.description || ''}`);

      new mapboxgl.Marker(el)
        .setLngLat([marker.coordinates.lng, marker.coordinates.lat])
        .setPopup(popup)
        .addTo(mapElem);
    });

    // Add routes if journey data is provided
    if (journey) {
      // Add each segment as a separate layer
      journey.segments.forEach((segment, index) => {
        // Create a GeoJSON source for this segment
        const sourceId = `route-source-${index}`;
        const layerId = `route-${segment.mode}-${index}`;
        
        // Define colors for different modes
        const colors = {
          driving: '#3887be', // blue
          walking: '#56B870', // green
          cycling: '#f9886c', // orange
          transit: '#9B59B6'  // purple
        };
        
        const color = colors[segment.mode as keyof typeof colors] || '#000';
        
        if (!mapElem.getSource(sourceId)) {
          mapElem.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: segment.geometry.coordinates
              }
            }
          });
        }
        
        if (!mapElem.getLayer(layerId)) {
          mapElem.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': color,
              'line-width': 5,
              'line-opacity': 0.8
            }
          });
        }
      });

      // Fit map to journey bounds if provided
      if (journey.bounds && journey.bounds.length > 0) {
        // Convert number[][] to LngLatBoundsLike for mapbox
        // Ensure we have exactly two points (southwest and northeast)
        if (journey.bounds.length >= 2 && journey.bounds[0].length >= 2 && journey.bounds[1].length >= 2) {
          const sw: [number, number] = [journey.bounds[0][0], journey.bounds[0][1]];
          const ne: [number, number] = [journey.bounds[1][0], journey.bounds[1][1]];
          
          mapElem.fitBounds([sw, ne], {
            padding: 50
          });
        }
      }
    }
  }, [mapLoaded, journey, markers]);

  return (
    <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg">
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
    </Card>
  );
};

export default MapDisplay;
