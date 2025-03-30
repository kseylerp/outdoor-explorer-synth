
import React from 'react';
import { Bike, Car, Map, Navigation, Bus, Footprints } from 'lucide-react';
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
    <div>
      <label className="block text-sm font-medium mb-2">Route Types</label>
      <ToggleGroup type="single" value={routeType} onValueChange={(value) => value && setRouteType(value)}>
        <ToggleGroupItem value="all" aria-label="All routes">
          <Map className="h-4 w-4 mr-2" />
          <span>All</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="walk" aria-label="Walking routes">
          <Footprints className="h-4 w-4 mr-2" />
          <span>Walk</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="bike" aria-label="Biking routes">
          <Bike className="h-4 w-4 mr-2" />
          <span>Bike</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="drive" aria-label="Driving routes">
          <Car className="h-4 w-4 mr-2" />
          <span>Drive</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="transit" aria-label="Transit routes">
          <Bus className="h-4 w-4 mr-2" />
          <span>Transit</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default RouteTypeSelector;
