
import type { NativeNavigationPlugin } from './NativeNavigationPlugin';

export class NativeNavigationWeb implements NativeNavigationPlugin {
  async startNavigation(options: { 
    startLat: number; 
    startLng: number; 
    endLat: number; 
    endLng: number; 
    mode: string;
    tripTitle: string;
  }): Promise<{ success: boolean; message: string }> {
    // Web fallback: open in Google Maps
    try {
      const mode = options.mode === 'driving' ? 'driving' : 'walking';
      const url = `https://www.google.com/maps/dir/?api=1&origin=${options.startLat},${options.startLng}&destination=${options.endLat},${options.endLng}&travelmode=${mode}`;
      
      window.open(url, '_blank');
      
      return {
        success: true,
        message: 'Opened in web browser map service'
      };
    } catch (error) {
      console.error('Error opening web maps:', error);
      return {
        success: false,
        message: 'Could not open web maps'
      };
    }
  }

  async isNavigationAvailable(): Promise<{ available: boolean }> {
    // Web always has some form of mapping available
    return { available: true };
  }
}
