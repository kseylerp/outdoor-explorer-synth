
import React from 'react';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

interface ApiConnectionErrorProps {
  onRetry?: () => void;
  customMessage?: string;
  errorDetails?: string;
}

const ApiConnectionError: React.FC<ApiConnectionErrorProps> = ({
  onRetry,
  customMessage,
  errorDetails
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };
  
  return (
    <Alert variant="destructive" className="my-4 bg-red-50 border-red-200">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-red-800 font-medium">Connection Error</AlertTitle>
      <AlertDescription className="text-red-700">
        <p className="mb-3">{customMessage || "Could not connect to AI service. Please try again later or contact support."}</p>
        
        {errorDetails && (
          <div className="mb-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleDetails}
              className="mb-2 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 flex items-center"
            >
              {showDetails ? "Hide Error Details" : "Show Error Details"}
              {showDetails ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
            </Button>
            
            {showDetails && (
              <div className="bg-red-100 p-3 rounded text-sm font-mono overflow-x-auto">
                {errorDetails}
              </div>
            )}
          </div>
        )}
        
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
