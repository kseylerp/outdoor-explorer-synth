
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
  // Always use OpenAI/Gemini, removing Claude option
  const [aiModel, setAiModel] = useState<'gemini'>('gemini');
  const { toast } = useToast();

  const handlePromptSubmit = async (prompt: string, voiceTripData?: any) => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    setThinking(undefined);
    setTrips([]);
    
    try {
      // If we have specific trip data from voice, use it to augment the prompt
      let processedPrompt = prompt;
      if (voiceTripData) {
        console.info('Using voice trip data to generate trips:', voiceTripData);
        // Augment the prompt with the voice data if available
        processedPrompt = `${prompt} 
        Destination: ${voiceTripData.destination || ''}
        Activities: ${voiceTripData.activities ? voiceTripData.activities.join(', ') : ''}
        Description: ${voiceTripData.description || ''}`;
      }
      
      console.info(`Submitting prompt to generate trips: ${processedPrompt}`);
      const result = await generateTrips(processedPrompt, (thinkingSteps) => {
        setThinking(thinkingSteps);
        setShowThinking(true);
      });
      
      if (result.length === 0) {
        throw new Error("No trip recommendations were generated. Please try again or use a different prompt.");
      }
      
      // Log the full trip data to debug description issues
      console.log("Received trip data:", JSON.stringify(result, null, 2));
      
      setTrips(result);
    } catch (error) {
      console.error('Error processing prompt:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check for specific API_KEY_MISSING error
      if (errorMessage.includes('API_KEY_MISSING')) {
        setError(`OpenAI API key is not configured`);
        setErrorDetails(`This application requires a valid API key to generate trip recommendations. Please contact the administrator to set up the OpenAI API key in the Supabase project settings.`);
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

  const handleVoiceTripData = (tripData: any, transcript: string) => {
    if (tripData && typeof tripData === 'object') {
      // Use the voice trip data along with the transcript to generate trips
      handlePromptSubmit(transcript, tripData);
    } else {
      // Fallback to just using the transcript if no structured data is available
      handlePromptSubmit(transcript);
    }
  };

  const handleRetry = () => {
    // Simple retry without model switching since we're only using OpenAI
    handlePromptSubmit('');
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
    handleVoiceTripData,
    handleRetry,
    handleSaveTrip
  };
}

export default useTrips;
