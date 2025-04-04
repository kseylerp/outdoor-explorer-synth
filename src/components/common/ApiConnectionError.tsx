
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ApiConnectionErrorProps {
  onRetry?: () => void;
  customMessage?: string;
}

const ApiConnectionError: React.FC<ApiConnectionErrorProps> = ({
  onRetry,
  customMessage
}) => {
  return (
    <Alert variant="destructive" className="my-4 bg-red-50 border-red-200">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-red-800 font-medium">Connection Error</AlertTitle>
      <AlertDescription className="text-red-700">
        <p className="mb-3">{customMessage || "Could not connect to AI service. Please try again later or contact support."}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ApiConnectionError;
