
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ItineraryExpanderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const ItineraryExpander: React.FC<ItineraryExpanderProps> = ({ isExpanded, onToggle }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onToggle}
      className="w-full flex items-center justify-center bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 font-medium"
    >
      {isExpanded ? (
        <>Hide Itinerary <ChevronUp className="ml-1 h-4 w-4" /></>
      ) : (
        <>Show Itinerary <ChevronDown className="ml-1 h-4 w-4" /></>
      )}
    </Button>
  );
};

export default ItineraryExpander;
