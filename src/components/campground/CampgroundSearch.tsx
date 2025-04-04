
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Campground, searchCampgrounds } from '@/services/campground/campgroundService';
import { useToast } from '@/hooks/use-toast';
import CampgroundList from './CampgroundList';

interface CampgroundSearchProps {
  location?: { lat: number; lng: number };
  onCampgroundSelected?: (campground: Campground) => void;
}

const CampgroundSearch: React.FC<CampgroundSearchProps> = ({ 
  location,
  onCampgroundSelected 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Campground[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search term to find campgrounds",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const campgrounds = await searchCampgrounds(searchQuery, location);
      setResults(campgrounds);
      
      if (campgrounds.length === 0) {
        toast({
          title: "No campgrounds found",
          description: `No campgrounds found for "${searchQuery}"`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error searching campgrounds:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search campgrounds",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for campgrounds..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>
      
      {location && (
        <div className="flex items-center text-sm text-purple-700">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Using your current trip location for nearby results</span>
        </div>
      )}
      
      {results.length > 0 && (
        <CampgroundList 
          campgrounds={results} 
          onSelect={onCampgroundSelected} 
        />
      )}
    </div>
  );
};

export default CampgroundSearch;
