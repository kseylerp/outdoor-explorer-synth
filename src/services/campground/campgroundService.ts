
import { supabase } from "@/integrations/supabase/client";

// Types for the campground data
export interface Campground {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  availableSites?: number;
  price?: {
    min: number;
    max: number;
    currency: string;
  };
  amenities?: string[];
  images?: string[];
  rating?: number;
  reviewCount?: number;
}

// Function to search for campgrounds
export const searchCampgrounds = async (
  searchQuery: string,
  location?: { lat: number; lng: number }
): Promise<Campground[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("campground-search", {
      body: {
        query: searchQuery,
        location
      },
    });

    if (error) {
      console.error("Error searching campgrounds:", error);
      throw new Error(`Failed to search campgrounds: ${error.message}`);
    }

    return data?.campgrounds || [];
  } catch (error) {
    console.error("Error in searchCampgrounds:", error);
    throw new Error(`Error searching campgrounds: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Function to get campground details
export const getCampgroundDetails = async (id: string): Promise<Campground> => {
  try {
    const { data, error } = await supabase.functions.invoke("campground-details", {
      body: {
        id
      },
    });

    if (error) {
      console.error("Error getting campground details:", error);
      throw new Error(`Failed to get campground details: ${error.message}`);
    }

    return data?.campground;
  } catch (error) {
    console.error("Error in getCampgroundDetails:", error);
    throw new Error(`Error getting campground details: ${error instanceof Error ? error.message : String(error)}`);
  }
};
