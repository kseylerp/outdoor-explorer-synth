
import React from 'react';
import { Info, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TripDescriptionProps {
  description: string;
  whyWeChoseThis: string;
  suggestedGuides?: string[];
  bestTimeToVisit?: string;
  seasonalInfo?: string;
  highlights?: string[];
  compact?: boolean;
}

const TripDescription: React.FC<TripDescriptionProps> = ({
  description,
  whyWeChoseThis,
  suggestedGuides,
  bestTimeToVisit,
  seasonalInfo,
  highlights,
  compact = false
}) => {
  if (compact) {
    return (
      <div>
        {whyWeChoseThis && (
          <>
            <h4 className="text-[14px] font-bold text-purple-700 dark:text-purple-300">Why we chose this</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{whyWeChoseThis}</p>
          </>
        )}
        
        {bestTimeToVisit && (
          <div className="mt-2">
            <h4 className="text-[14px] font-bold text-green-700 dark:text-green-400">Best Time to Visit</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{bestTimeToVisit}</p>
          </div>
        )}
        
        {suggestedGuides && suggestedGuides.length > 0 && (
          <div className="mt-2">
            <h4 className="text-[14px] font-bold text-purple-700 dark:text-purple-300">Suggested Guides</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {suggestedGuides.map((guide, idx) => (
                <span key={idx} className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded">
                  {guide}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="prose max-w-none mb-6">
      <h3 className="text-lg font-semibold">About This Trip</h3>
      {description ? (
        <p>{description}</p>
      ) : null}
      
      {/* Highlights section */}
      {highlights && highlights.length > 0 && (
        <div className="my-4">
          <h4 className="text-md font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Star className="h-4 w-4 text-amber-500" />
            Highlights
          </h4>
          <ul className="mt-2 space-y-1">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 inline-block mt-1">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {whyWeChoseThis && (
        <div className="bg-purple-50 dark:bg-gray-800 p-4 rounded-md my-4 border-l-4 border-purple-300 dark:border-purple-600 why-we-chose-box">
          <h4 className="text-md font-semibold flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Why We Chose This
          </h4>
          <p className="text-sm dark:text-gray-200">{whyWeChoseThis}</p>
        </div>
      )}
      
      {/* Seasonal Info */}
      {seasonalInfo && (
        <div className="my-4">
          <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300">Seasonal Information</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{seasonalInfo}</p>
        </div>
      )}
      
      {suggestedGuides && suggestedGuides.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold">Suggested Guides</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {suggestedGuides.map((guide, idx) => (
              <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                {guide}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDescription;
