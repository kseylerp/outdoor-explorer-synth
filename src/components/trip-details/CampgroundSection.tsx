
import React, { useState } from 'react';
import CampgroundSearch from '../campground/CampgroundSearch';
import CampgroundDetails from '../campground/CampgroundDetails';
import { Campground } from '@/services/campground/campgroundService';
import { useToast } from '@/hooks/use-toast';

interface CampgroundSectionProps {
  location?: { lat: number, lng: number };
}

const CampgroundSection: React.FC<CampgroundSectionProps> = ({ location }) => {
  const [selectedCampground, setSelectedCampground] = useState<Campground | null>(null);
  const { toast } = useToast();

  const handleCampgroundSelected = (campground: Campground) => {
    setSelectedCampground(campground);
  };

  const handleBackToCampgrounds = () => {
    setSelectedCampground(null);
  };

  const handleBookCampground = (campground: Campground) => {
    // For now, just show a toast. This would be extended later.
    toast({
      title: "Booking initiated",
      description: `You're booking ${campground.name}. This feature is coming soon!`,
    });
  };

  return (
    <div className="mb-6">
      {!selectedCampground ? (
        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="text-md font-medium mb-3">Find Campgrounds Near Your Trip</h4>
          <CampgroundSearch 
            location={location}
            onCampgroundSelected={handleCampgroundSelected}
          />
        </div>
      ) : (
        <CampgroundDetails
          campground={selectedCampground}
          onBack={handleBackToCampgrounds}
          onBook={handleBookCampground}
        />
      )}
    </div>
  );
};

export default CampgroundSection;
