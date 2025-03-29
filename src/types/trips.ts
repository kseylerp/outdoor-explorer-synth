
export interface Coordinates {
  lng: number;
  lat: number;
}

export interface Step {
  maneuver: {
    instruction: string;
    location: number[];
  };
  distance: number;
  duration: number;
}

export interface Segment {
  mode: string;
  from: string;
  to: string;
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
  };
  steps: Step[];
  elevationGain?: number;
  terrain?: string;
  description?: string;
}

export interface Journey {
  segments: Segment[];
  totalDistance: number;
  totalDuration: number;
  bounds: number[][];
}

export interface Activity {
  name: string;
  type: string;
  duration: string;
  description: string;
  permitRequired: boolean;
  permitDetails?: string;
  outfitters?: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  whyWeChoseThis: string;
  difficultyLevel: string;
  priceEstimate: string;
  duration: string;
  location: string;
  suggestedGuides?: string[];
  mapCenter: Coordinates;
  markers?: Array<{
    name: string;
    coordinates: Coordinates;
    description?: string;
    elevation?: string | number;
    details?: string;
  }>;
  journey?: Journey;
  itinerary: ItineraryDay[];
}
