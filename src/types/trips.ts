
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
  location?: string;
  price?: number | string;
  equipmentNeeded?: string[];
  weather?: string;
  difficulty?: string;
  distance?: number | string;
  elevation?: number | string;
  routeType?: 'out-and-back' | 'loop' | 'one-way' | 'multi-day' | string;
  waypoints?: {
    name: string;
    coordinates: Coordinates;
    description?: string;
  }[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodations?: string;
  travelDuration?: string;
  travelMode?: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  whyWeChoseThis: string;
  difficultyLevel: string;
  priceEstimate: number;
  priceBreakdown?: Record<string, number | string>;
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
  seasonalInfo?: string;
  bestTimeToVisit?: string;
  permits?: {
    required: boolean;
    details?: string;
  };
  weatherInfo?: string;
  equipmentRecommendations?: string[];
  localTips?: string[];
  accessibility?: string;
  environmentalImpact?: string;
  alternativeOptions?: string[];
  highlights?: string[];
  safetyNotes?: string;
  languagesSpoken?: string[];
  currency?: string;
  timeZone?: string;
  visaRequirements?: string;
}
