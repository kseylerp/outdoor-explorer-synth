
import React from 'react';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TripDescriptionProps {
  description: string;
  whyWeChoseThis: string;
  suggestedGuides?: string[];
}

const TripDescription: React.FC<TripDescriptionProps> = ({
  description,
  whyWeChoseThis,
  suggestedGuides
}) => {
  return (
    <div className="prose max-w-none mb-6">
      <h3 className="text-lg font-semibold">About This Trip</h3>
      <p>{description || 'No description available'}</p>
      
      <div className="bg-purple-50 p-4 rounded-md my-4 border-l-4 border-purple-300">
        <h4 className="text-md font-semibold flex items-center gap-2 text-purple-800">
          <Info className="h-4 w-4 text-purple-600" />
          Why We Chose This
        </h4>
        <p className="text-sm">{whyWeChoseThis || 'No information available'}</p>
      </div>
      
      {suggestedGuides && suggestedGuides.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold">Suggested Guides</h4>
          <div className="flex flex-wrap gap-1 mt-1">
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
