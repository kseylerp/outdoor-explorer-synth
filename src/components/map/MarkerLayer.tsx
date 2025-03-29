
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

      // Create more detailed popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        maxWidth: '300px',
        className: 'custom-popup'
      }).setHTML(`
        <div style="padding: 5px;">
          <h3 style="font-weight: bold; margin-bottom: 5px; color: #574780;">${marker.name}</h3>
          <p style="margin: 0; font-size: 14px;">${marker.description || ''}</p>
          ${marker.elevation ? `<p style="margin-top: 5px; font-size: 12px; color: #666;">Elevation: ${marker.elevation} ft</p>` : ''}
          ${marker.details ? `<p style="margin-top: 5px; font-size: 12px;">${marker.details}</p>` : ''}
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
          padding: 12px;
          border-left: 4px solid #9870FF;
        }
        .mapboxgl-popup-close-button {
          font-size: 16px;
          color: #574780;
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
