
/**
 * Component for displaying quick response buttons
 * 
 * Features:
 * - Displays a set of predefined response options as buttons
 * - Handles selection of options
 * - Properly styled buttons for the voice interface
 */
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickResponsesProps {
  responses: Array<{ text: string; value: string }>;
  onResponse: (value: string) => void;
}

const QuickResponses: React.FC<QuickResponsesProps> = ({ responses, onResponse }) => {
  // If no responses are provided, don't render anything
  if (!responses.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 mt-6 justify-center">
      {responses.map((response, index) => (
        <Button
          key={index}
          onClick={() => onResponse(response.value)}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          {response.text}
        </Button>
      ))}
    </div>
  );
};

export default QuickResponses;
