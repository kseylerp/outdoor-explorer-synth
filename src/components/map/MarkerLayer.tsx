
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapMarker } from './types';

interface MarkerLayerProps {
  map: mapboxgl.Map;
  markers: MapMarker[];
}

const MarkerLayer: React.FC<MarkerLayerProps> = ({ map, markers }) => {
  useEffect(() => {
    if (!map || !markers.length) return;
    
    // Create array to track markers for cleanup
    const mapMarkers: mapboxgl.Marker[] = [];
    
    // Add markers with enhanced visibility
    markers.forEach(marker => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div style="
          width: 25px;
          height: 25px;
          background-color: #9870FF;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 12px;
          transform: translate(-50%, -50%)
        ">
          <span style="transform: translateY(-1px);">●</span>
        </div>
      `;

      // Create more detailed popup with improved layout for better content fit
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        maxWidth: '250px',
        className: 'custom-popup'
      }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 5px; color: #574780; font-size: 14px;">${marker.name}</h3>
          ${marker.description ? `<p style="margin: 0; font-size: 12px; line-height: 1.3;">${marker.description}</p>` : ''}
          ${marker.elevation ? `<p style="margin-top: 5px; font-size: 11px; color: #666;">Elevation: ${marker.elevation} ft</p>` : ''}
          ${marker.details ? `<p style="margin-top: 5px; font-size: 11px; line-height: 1.3;">${marker.details}</p>` : ''}
        </div>
      `);

      const mapMarker = new mapboxgl.Marker(markerElement)
        .setLngLat([marker.coordinates.lng, marker.coordinates.lat])
        .setPopup(popup)
        .addTo(map);
        
      mapMarkers.push(mapMarker);
    });

    // Add CSS for the custom popup
    if (!document.getElementById('custom-popup-style')) {
      const style = document.createElement('style');
      style.id = 'custom-popup-style';
      style.innerHTML = `
        .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          padding: 10px;
          border-left: 4px solid #9870FF;
          max-width: 250px;
          word-wrap: break-word;
          font-size: 12px;
        }
        .mapboxgl-popup-close-button {
          font-size: 16px;
          color: #574780;
        }
        .mapboxgl-popup {
          z-index: 10;
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function to remove markers when component unmounts
    return () => {
      mapMarkers.forEach(marker => marker.remove());
      const styleElement = document.getElementById('custom-popup-style');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [map, markers]);

  return null; // This is a behavior component, not a visual one
};

export default MarkerLayer;
