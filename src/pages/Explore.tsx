
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/trip-card';
import { generateTrips } from '@/services/trip/tripService';
import { Trip } from '@/types/trips';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, AlertOctagon } from 'lucide-react';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Explore: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [thinking, setThinking] = useState<string[] | undefined>(undefined);
  const [showThinking, setShowThinking] = useState(false);
  const [aiModel, setAiModel] = useState<'claude' | 'gemini'>(
    () => (localStorage.getItem('preferredAiModel') as 'claude' | 'gemini') || 'gemini'
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Listen for changes to the AI model preference
  useEffect(() => {
    const handleStorageChange = () => {
      const storedModel = localStorage.getItem('preferredAiModel') as 'claude' | 'gemini';
      if (storedModel && storedModel !== aiModel) {
        setAiModel(storedModel);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [aiModel]);

  const handlePromptSubmit = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    setThinking(undefined);
    setTrips([]);
    
    try {
      console.info(`Submitting prompt to generate trips with ${aiModel}: ${prompt}`);
      const result = await generateTrips(prompt, (thinkingSteps) => {
        setThinking(thinkingSteps);
        setShowThinking(true);
      });
      
      if (result.length === 0) {
        throw new Error("No trip recommendations were generated. Please try again or use a different prompt.");
      }
      
      setTrips(result);
    } catch (error) {
      console.error('Error processing prompt:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check for specific API_KEY_MISSING error
      if (errorMessage.includes('API_KEY_MISSING')) {
        const modelName = aiModel === 'claude' ? 'Claude (Anthropic)' : 'Gemini (Google)';
        setError(`${modelName} API key is not configured`);
        setErrorDetails(`This application requires a valid API key to generate trip recommendations. Please contact the administrator to set up the ${modelName} API key in the Supabase project settings.`);
      } else if (errorMessage.includes("|")) {
        // Split error message if it contains details
        const [mainError, details] = errorMessage.split("|", 2);
        setError(mainError.trim());
        setErrorDetails(details.trim());
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Switch AI models if error occurred
    if (error && error.includes('API key')) {
      const newModel = aiModel === 'claude' ? 'gemini' : 'claude';
      localStorage.setItem('preferredAiModel', newModel);
      setAiModel(newModel);
      toast({
        title: `Switched to ${newModel === 'claude' ? 'Claude' : 'Gemini'} model`,
        description: `Trying with ${newModel === 'claude' ? 'Claude' : 'Gemini'} instead.`,
      });
    }
  };

  const handleSaveTrip = (trip: Trip) => {
    try {
      // Get existing saved trips or initialize empty array
      const savedTripsJson = localStorage.getItem('savedTrips') || '[]';
      const savedTrips = JSON.parse(savedTripsJson);
      
      // Check if already saved
      if (savedTrips.some((saved: Trip) => saved.id === trip.id)) {
        toast({
          title: "Already saved",
          description: "This trip is already in your saved collection",
        });
        return;
      }
      
      // Add to saved trips
      savedTrips.push(trip);
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      
      toast({
        title: "Trip saved!",
        description: "This adventure has been added to your saved trips",
      });
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: "Error saving trip",
        description: "Could not save this adventure. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let's find an <span className="offbeat-gradient">offbeat</span> adventure
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powered by local guides: explore, plan, and experience better trips
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {error && error.includes('API key') && (
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
                onClick={handleRetry}
              >
                Try with {aiModel === 'claude' ? 'Gemini' : 'Claude'} instead
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <PromptInput 
          onSubmit={handlePromptSubmit} 
          isProcessing={loading} 
          defaultValue=""
          placeholder="Tell us about your dream trip. For example: A 5-day moderate hiking trip near Portland with waterfall views and minimal crowds"
        />
      </div>

      {error && !error.includes('API key') && (
        <ApiConnectionError 
          customMessage={error}
          errorDetails={errorDetails || undefined}
          onRetry={() => handlePromptSubmit('')}
        />
      )}

      {loading && (
        <div className="mb-8">
          <LoadingSpinner />
          {thinking && thinking.length > 0 && <ThinkingDisplay thinkingSteps={thinking} isVisible={showThinking} />}
        </div>
      )}

      {trips.length > 0 && (
        <div className="space-y-8">
          {trips.map((trip, index) => (
            <div key={trip.id || `trip-${index}`} className="relative">
              {trips.length > 1 && (
                <div className="absolute -top-4 -left-2 z-10">
                  <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Option {index + 1}
                  </span>
                </div>
              )}
              <TripCard 
                trip={trip}
                onSave={() => handleSaveTrip(trip)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
