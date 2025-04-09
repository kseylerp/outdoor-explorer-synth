
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ItineraryExpanderProps {
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * ItineraryExpander provides collapsible functionality for trip itineraries
 */
const ItineraryExpander: React.FC<ItineraryExpanderProps> = ({ 
  isExpanded, 
  onToggle, 
  children 
}) => {
  // Stop event propagation when clicking on the expander
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <Collapsible
      open={isExpanded}
      className="w-full border-t border-purple-200"
    >
      <CollapsibleTrigger 
        className="w-full flex items-center justify-center py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium"
        onClick={handleTriggerClick}
      >
        {isExpanded ? (
          <>Hide Itinerary <ChevronUp className="ml-1 h-4 w-4" /></>
        ) : (
          <>Show Itinerary <ChevronDown className="ml-1 h-4 w-4" /></>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent onClick={(e) => e.stopPropagation()}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ItineraryExpander;
