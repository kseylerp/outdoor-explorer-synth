
import React from 'react';

interface TripCardInfoProps {
  whyWeChoseThis: string;
  duration: string;
  priceEstimate: number;
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
        <div>
          <span className="text-gray-600 block">Duration</span>
          <span className="font-medium">{duration}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Est. Price</span>
          <span className="font-medium">{formattedPrice}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Location</span>
          <span className="font-medium">{location}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Difficulty</span>
          <span className="font-medium">{difficultyLevel}</span>
        </div>
      </div>
      
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
