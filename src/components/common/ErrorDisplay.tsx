
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  errorMessage: string;
  onRetry?: () => void;
  onReturn?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errorMessage, 
  onRetry, 
  onReturn 
}) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Trip</h2>
      <p className="text-gray-600 mb-6">{errorMessage}</p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            Retry Loading
          </Button>
        )}
        {onReturn && (
          <Button onClick={onReturn} variant="outline">
            Return to Adventures
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
