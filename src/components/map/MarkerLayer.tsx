
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapMarker } from './types';
import { createMarkerElement } from './map-utils';

interface MarkerLayerProps {
  map: mapboxgl.Map;
  markers: MapMarker[];
}

const MarkerLayer: React.FC<MarkerLayerProps> = ({ map, markers }) => {
  useEffect(() => {
    if (!map || !markers.length) return;
    
    // Create array to track markers for cleanup
    const mapMarkers: mapboxgl.Marker[] = [];
    
    // Add markers
    markers.forEach(marker => {
      const el = createMarkerElement();

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${marker.name}</h3>${marker.description || ''}`);

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.coordinates.lng, marker.coordinates.lat])
        .setPopup(popup)
        .addTo(map);
        
      mapMarkers.push(mapMarker);
    });

    // Cleanup function to remove markers when component unmounts
    return () => {
      mapMarkers.forEach(marker => marker.remove());
    };
  }, [map, markers]);

  return null; // This is a behavior component, not a visual one
};

export default MarkerLayer;
