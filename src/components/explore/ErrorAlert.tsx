
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ErrorAlertProps {
  error: string;
  aiModel: 'claude' | 'gemini' | 'openai';
  helpText?: string | null;
  onRetry: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  aiModel, 
  helpText, 
  onRetry 
}) => {
  const isApiKeyError = error?.toLowerCase().includes('api key');
  
  let modelName = 'AI';
  if (aiModel === 'claude') modelName = 'Claude';
  if (aiModel === 'gemini') modelName = 'Gemini';
  if (aiModel === 'openai') modelName = 'OpenAI';
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertOctagon className="h-4 w-4" />
      <AlertTitle>API Configuration Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{error}</p>
        
        {helpText && (
          <p className="mb-2 text-sm">{helpText}</p>
        )}
        
        {!helpText && isApiKeyError && (
          <p className="mb-2">
            This app requires a valid {modelName} API key to generate trip recommendations. 
            Please contact the administrator to set up the API keys in the Supabase project.
          </p>
        )}
        
        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
