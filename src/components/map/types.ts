import { Journey } from '@/types/trips';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface MapMarker {
  name: string;
  coordinates: Coordinates;
  description?: string;
  elevation?: string | number;
  details?: string;
}

export interface MapDisplayProps {
  journey?: Journey;
  markers?: MapMarker[];
  center?: Coordinates;
  interactive?: boolean;
  routeType?: string;
}
