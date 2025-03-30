
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationOptionsProps {
  transportMode: string;
  setTransportMode: (mode: string) => void;
}

const NavigationOptions: React.FC<NavigationOptionsProps> = ({ 
  transportMode, 
  setTransportMode 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Transportation Mode</label>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant={transportMode === 'driving' ? 'default' : 'outline'}
          onClick={() => setTransportMode('driving')}
          className={transportMode === 'driving' ? 'bg-purple-600' : ''}
        >
          Driving
        </Button>
        <Button 
          variant={transportMode === 'walking' ? 'default' : 'outline'}
          onClick={() => setTransportMode('walking')}
          className={transportMode === 'walking' ? 'bg-purple-600' : ''}
        >
          Walking
        </Button>
      </div>
    </div>
  );
};

export default NavigationOptions;
