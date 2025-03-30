
import React from 'react';
import { Card } from '@/components/ui/card';

interface MapStatusProps {
  isLoading: boolean;
  isError: boolean;
  isInteractive: boolean;
  onEnableInteractiveMode: () => void;
}

const MapStatus: React.FC<MapStatusProps> = ({ 
  isLoading, 
  isError, 
  isInteractive,
  onEnableInteractiveMode 
}) => {
  if (isError) {
    return (
      <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500">Error loading map</p>
          <p className="text-sm text-gray-500">Please check your Mapbox configuration</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full h-full min-h-[300px] overflow-hidden rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </Card>
    );
  }

  if (!isInteractive) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center cursor-pointer z-10">
        <div className="bg-white bg-opacity-90 rounded-md px-3 py-2 text-sm font-medium text-gray-700 shadow-md pointer-events-none">
          Click to interact with map
        </div>
      </div>
    );
  }

  return null;
};

export default MapStatus;
