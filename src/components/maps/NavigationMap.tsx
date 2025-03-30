
import React from 'react';
import { Card } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Capacitor } from '@capacitor/core';

interface NavigationMapProps {
  isNativeAvailable: boolean;
}

const NavigationMap: React.FC<NavigationMapProps> = ({ isNativeAvailable }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-[500px] p-0 overflow-hidden">
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <Navigation size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">Navigation Ready</h3>
          <p className="text-gray-600 mb-4">
            Select a saved trip to begin turn-by-turn navigation
          </p>
          {isMobile && (
            <p className="text-sm text-purple-600">
              {Capacitor.isNativePlatform() && isNativeAvailable
                ? "Will use native device navigation for optimal experience"
                : "Uses web-based mapping for directions"}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NavigationMap;
