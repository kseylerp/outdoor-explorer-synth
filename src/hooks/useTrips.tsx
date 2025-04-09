
import { useState, useEffect } from 'react';
import { Trip } from '@/types/trips';
import { generateTrips } from '@/services/trip/tripService';
import { useToast } from '@/hooks/use-toast';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [thinking, setThinking] = useState<string[] | undefined>(undefined);
  const [showThinking, setShowThinking] = useState(false);
  const [aiModel, setAiModel] = useState<'claude' | 'gemini'>(
    () => (localStorage.getItem('preferredAiModel') as 'claude' | 'gemini') || 'gemini'
  );
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

  return {
    trips,
    loading,
    error,
    errorDetails,
    thinking,
    showThinking,
    aiModel,
    handlePromptSubmit,
    handleRetry,
    handleSaveTrip
  };
}

export default useTrips;
