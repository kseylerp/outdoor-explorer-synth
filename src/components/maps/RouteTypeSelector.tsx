
import React from 'react';
import { Bike, Car, Map, Navigation, Bus, Footprints } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

interface RouteTypeSelectorProps {
  routeType: string;
  setRouteType: (type: string) => void;
}

const RouteTypeSelector: React.FC<RouteTypeSelectorProps> = ({ 
  routeType, 
  setRouteType 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Route Types</label>
      <ToggleGroup 
        type="single" 
        value={routeType} 
        onValueChange={(value) => value && setRouteType(value)}
        className={`flex ${isMobile ? 'flex-wrap gap-1' : 'flex-nowrap'}`}
      >
        <ToggleGroupItem value="all" aria-label="All routes" className={isMobile ? 'text-xs' : ''}>
          <Map className="h-4 w-4 mr-1" />
          <span>All</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="walk" aria-label="Walking routes" className={isMobile ? 'text-xs' : ''}>
          <Footprints className="h-4 w-4 mr-1" />
          <span>Walk</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="bike" aria-label="Biking routes" className={isMobile ? 'text-xs' : ''}>
          <Bike className="h-4 w-4 mr-1" />
          <span>Bike</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="drive" aria-label="Driving routes" className={isMobile ? 'text-xs' : ''}>
          <Car className="h-4 w-4 mr-1" />
          <span>Drive</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="transit" aria-label="Transit routes" className={isMobile ? 'text-xs' : ''}>
          <Bus className="h-4 w-4 mr-1" />
          <span>Transit</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default RouteTypeSelector;
