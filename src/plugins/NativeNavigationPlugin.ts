
import { registerPlugin } from '@capacitor/core';

export interface NativeNavigationPlugin {
  startNavigation(options: { 
    startLat: number; 
    startLng: number; 
    endLat: number; 
    endLng: number; 
    mode: string;
    tripTitle: string;
  }): Promise<{ success: boolean; message: string }>;
  
  isNavigationAvailable(): Promise<{ available: boolean }>;
}

const NativeNavigation = registerPlugin<NativeNavigationPlugin>('NativeNavigation', {
  web: () => import('./NativeNavigationWeb').then(m => new m.NativeNavigationWeb()),
});

export default NativeNavigation;
