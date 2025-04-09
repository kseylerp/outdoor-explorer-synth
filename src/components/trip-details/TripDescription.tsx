
import React from 'react';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TripDescriptionProps {
  description: string;
  whyWeChoseThis: string;
  suggestedGuides?: string[];
  compact?: boolean;
}

const TripDescription: React.FC<TripDescriptionProps> = ({
  description,
  whyWeChoseThis,
  suggestedGuides,
  compact = false
}) => {
  // Log description data to check for potential truncation
  console.log('TripDescription - description length:', description?.length || 0);
  console.log('TripDescription - whyWeChoseThis length:', whyWeChoseThis?.length || 0);
  
  if (compact) {
    return (
      <div>
        {whyWeChoseThis && (
          <>
            <h4 className="text-[14px] font-bold text-purple-700 break-words">Why we chose this</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{whyWeChoseThis}</p>
          </>
        )}
        
        {suggestedGuides && suggestedGuides.length > 0 && (
          <div className="mt-2">
            <h4 className="text-[14px] font-bold text-purple-700 break-words">Suggested Guides</h4>
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
  }
  
  return (
    <div className="prose max-w-none mb-6">
      <h3 className="text-lg font-semibold break-words">About This Trip</h3>
      {description ? (
        <p className="whitespace-pre-line">{description}</p>
      ) : null}
      
      {whyWeChoseThis && (
        <div className="bg-purple-50 p-4 rounded-md my-4 border-l-4 border-purple-300">
          <h4 className="text-md font-semibold flex items-center gap-2 text-purple-800 break-words">
            <Info className="h-4 w-4 text-purple-600 flex-shrink-0" />
            Why We Chose This
          </h4>
          <p className="text-sm whitespace-pre-line">{whyWeChoseThis}</p>
        </div>
      )}
      
      {suggestedGuides && suggestedGuides.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold break-words">Suggested Guides</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedGuides.map((guide, idx) => (
              <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700">
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
