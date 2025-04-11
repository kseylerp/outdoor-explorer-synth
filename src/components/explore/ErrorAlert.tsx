
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  error: string;
  aiModel: 'claude' | 'gemini';
  onRetry: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, aiModel, onRetry }) => {
  if (!error || !error.includes('API key')) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertOctagon className="h-4 w-4" />
      <AlertTitle>API Configuration Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">The {aiModel === 'claude' ? 'Claude' : 'Gemini'} API key is not configured.</p>
        <p>This app requires a valid API key to generate trip recommendations. Please contact the administrator to set up the API keys in the Supabase project.</p>
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
          >
            Try with {aiModel === 'claude' ? 'Gemini' : 'Claude'} instead
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
