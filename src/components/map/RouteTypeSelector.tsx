
import React from 'react';
import { Bike, Car, Map, Bus, Footprints } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface RouteTypeSelectorProps {
  routeType: string;
  setRouteType: (type: string) => void;
}

const RouteTypeSelector: React.FC<RouteTypeSelectorProps> = ({ 
  routeType, 
  setRouteType 
}) => {
  return (
    <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-md shadow-md p-1">
      <ToggleGroup 
        type="single" 
        value={routeType} 
        onValueChange={(value) => value && setRouteType(value)}
        className="flex"
      >
        <ToggleGroupItem value="all" aria-label="All routes" className="flex items-center gap-1 p-1">
          <Map className="h-4 w-4" />
          <span className="text-xs">All</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="walk" aria-label="Walking routes" className="flex items-center gap-1 p-1">
          <Footprints className="h-4 w-4" />
          <span className="text-xs">Walk</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="bike" aria-label="Biking routes" className="flex items-center gap-1 p-1">
          <Bike className="h-4 w-4" />
          <span className="text-xs">Bike</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="drive" aria-label="Driving routes" className="flex items-center gap-1 p-1">
          <Car className="h-4 w-4" />
          <span className="text-xs">Drive</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="transit" aria-label="Transit routes" className="flex items-center gap-1 p-1">
          <Bus className="h-4 w-4" />
          <span className="text-xs">Transit</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default RouteTypeSelector;
