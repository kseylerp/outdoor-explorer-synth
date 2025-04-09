
import React from 'react';
import { CalendarClock, MapPin, Clock, HardHat, DollarSign, Calendar } from 'lucide-react';

interface TripCardInfoProps {
  whyWeChoseThis: string;
  duration: string;
  priceEstimate: number;
  location: string;
  difficultyLevel: string;
  suggestedGuides?: string[];
  bestTimeToVisit?: string;
  seasonalInfo?: string;
}

const TripCardInfo: React.FC<TripCardInfoProps> = ({
  whyWeChoseThis,
  duration,
  priceEstimate,
  location,
  difficultyLevel,
  suggestedGuides,
  bestTimeToVisit,
  seasonalInfo
}) => {
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(priceEstimate);

  return (
    <div className="flex-1 space-y-3">
      {/* Trip Info Key Details */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-start gap-1">
          <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
          <div>
            <span className="text-gray-600 block">Duration</span>
            <span className="font-medium">{duration}</span>
          </div>
        </div>
        <div className="flex items-start gap-1">
          <DollarSign className="h-4 w-4 text-purple-600 mt-0.5" />
          <div>
            <span className="text-gray-600 block">Est. Price</span>
            <span className="font-medium">{formattedPrice}</span>
          </div>
        </div>
        <div className="flex items-start gap-1">
          <MapPin className="h-4 w-4 text-purple-600 mt-0.5" />
          <div>
            <span className="text-gray-600 block">Location</span>
            <span className="font-medium">{location}</span>
          </div>
        </div>
        <div className="flex items-start gap-1">
          <HardHat className="h-4 w-4 text-purple-600 mt-0.5" />
          <div>
            <span className="text-gray-600 block">Difficulty</span>
            <span className="font-medium">{difficultyLevel}</span>
          </div>
        </div>
      </div>
      
      {/* Best Time to Visit */}
      {bestTimeToVisit && (
        <div className="flex items-start gap-1 mt-3 pt-2 border-t border-gray-100">
          <CalendarClock className="h-4 w-4 text-green-600 mt-0.5" />
          <div>
            <span className="text-gray-600 text-sm">Best Time to Visit</span>
            <p className="text-sm">{bestTimeToVisit}</p>
          </div>
        </div>
      )}

      {/* Seasonal Info */}
      {seasonalInfo && (
        <div className="flex items-start gap-1 mt-2">
          <Calendar className="h-4 w-4 text-amber-600 mt-0.5" />
          <div>
            <span className="text-gray-600 text-sm">Seasonal Notes</span>
            <p className="text-sm">{seasonalInfo}</p>
          </div>
        </div>
      )}
      
      {/* Why We Chose This */}
      <div>
        <h4 className="text-[14px] font-bold text-purple-700">Why we chose this</h4>
        <p className="text-sm text-gray-600">{whyWeChoseThis}</p>
      </div>
      
      {/* Suggested Guides */}
      {suggestedGuides && suggestedGuides.length > 0 && (
        <div>
          <h4 className="text-[14px] font-bold text-purple-700">Suggested Guides</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {suggestedGuides.map((guide, idx) => (
              <span key={idx} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                {guide}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCardInfo;
