
import React from 'react';
import { Clock, DollarSign, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TripIntensityBar from '@/components/TripIntensityBar';

interface TripCardInfoProps {
  whyWeChoseThis: string;
  duration: string;
  priceEstimate: string;
  location: string;
  difficultyLevel: string;
  suggestedGuides?: string[];
}

const TripCardInfo: React.FC<TripCardInfoProps> = ({ 
  whyWeChoseThis, 
  duration, 
  priceEstimate, 
  location, 
  difficultyLevel,
  suggestedGuides 
}) => {
  // Calculate intensity level based on difficulty
  const getIntensityLevel = (level: string): number => {
    switch (level.toLowerCase()) {
      case 'easy': return 15;
      case 'moderate': return 40;
      case 'challenging': return 60;
      case 'difficult': return 80;
      case 'expert': 
      case 'extreme': return 95;
      default: return 50;
    }
  };

  return (
    <div className="flex flex-col justify-between w-full sm:w-1/2">
      <div>
        <h3 className="font-semibold text-md mb-1">Why We Chose This:</h3>
        <p className="text-sm text-gray-600 mb-4">{whyWeChoseThis}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            {duration}
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
            {priceEstimate}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            {location}
          </div>
        </div>
        
        <div className="mb-4">
          <TripIntensityBar level={getIntensityLevel(difficultyLevel)} readOnly />
        </div>
      </div>
      
      {suggestedGuides && suggestedGuides.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-md mb-1">Suggested Guides:</h3>
          <div className="flex flex-wrap gap-1">
            {suggestedGuides.map((guide, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {guide}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCardInfo;
