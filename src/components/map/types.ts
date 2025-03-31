
import { Coordinates, Journey } from '@/types/trips';

export type { Coordinates };  // Export the Coordinates type

export interface MapMarker {
  name: string;
  coordinates: Coordinates;
  description?: string;
  elevation?: string | number;
  details?: string;
  activityNote?: string;
}

export interface MapDisplayProps {
  journey?: Journey;
  markers?: MapMarker[];
  center?: Coordinates;
  interactive?: boolean;
  showElevation?: boolean;
}
