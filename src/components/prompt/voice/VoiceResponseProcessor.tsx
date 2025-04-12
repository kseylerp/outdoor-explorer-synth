
/**
 * Component for processing and displaying voice responses
 * 
 * Features:
 * - Shows processing state for voice responses
 * - Displays AI responses
 * - Shows quick response options when available
 * - Provides completion button when processing is done
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import QuickResponses from './QuickResponses';

interface VoiceResponseProcessorProps {
  aiResponseText: string | null;
  processingComplete: boolean;
  quickResponses: Array<{text: string, value: string}>;
  onClose: () => void;
  onQuickResponse: (value: string) => void;
}

const VoiceResponseProcessor: React.FC<VoiceResponseProcessorProps> = ({
  aiResponseText,
  processingComplete,
  quickResponses,
  onClose,
  onQuickResponse
}) => {
  return (
    <>
      <div className="text-white/70 text-sm max-w-md text-center px-4">
        {processingComplete
          ? "Ready to explore your adventure options? Click outside to view them."
          : "I'm processing your request..."}
      </div>
      
      {quickResponses.length > 0 && (
        <QuickResponses responses={quickResponses} onResponse={onQuickResponse} />
      )}
      
      {processingComplete && (
        <Button 
          onClick={onClose}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
        >
          Show My Adventure Options
        </Button>
      )}
    </>
  );
};

export default VoiceResponseProcessor;
