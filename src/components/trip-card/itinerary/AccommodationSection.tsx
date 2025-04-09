
import React from 'react';
import { Home } from 'lucide-react';

interface AccommodationSectionProps {
  accommodations: string | undefined;
}

const AccommodationSection: React.FC<AccommodationSectionProps> = ({ accommodations }) => {
  if (!accommodations) return null;
  
  return (
    <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-1">
        <Home className="h-4 w-4 text-blue-700" />
        <h5 className="text-md font-medium text-blue-800">Accommodations</h5>
      </div>
      <p className="text-sm text-gray-700">{accommodations}</p>
    </div>
  );
};

export default AccommodationSection;
