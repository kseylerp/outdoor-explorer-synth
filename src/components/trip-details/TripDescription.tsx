
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TripDescriptionProps {
  description?: string;
  whyWeChoseThis?: string;
  suggestedGuides?: string[];
  bestTimeToVisit?: string;
  seasonalInfo?: string;
  highlights?: string[];
  compact?: boolean;
}

const TripDescription: React.FC<TripDescriptionProps> = ({
  description,
  whyWeChoseThis,
  highlights,
  suggestedGuides,
  compact = false
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-[#202030]">
      <CardContent className="pt-6">
        {description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>
        )}
        
        {/* Highlights section */}
        {highlights && highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Highlights</h3>
            <ul className="list-disc list-inside space-y-1">
              {highlights.map((highlight, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{highlight}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Why We Chose This section */}
        {whyWeChoseThis && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Why We Chose This</h3>
            <div className="bg-gray-100 p-4 rounded-md border border-gray-200 dark:bg-[#202030] dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 italic">{whyWeChoseThis}</p>
            </div>
          </div>
        )}
        
        {/* Trip Outfitters/Guides - only show at trip level */}
        {suggestedGuides && suggestedGuides.length > 0 && !compact && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Suggested Outfitters</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedGuides.map((guide, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {guide}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripDescription;
