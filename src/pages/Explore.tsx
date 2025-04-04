
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/trip-card';
import { generateTrips } from '@/services/trip/tripService';
import { Trip } from '@/types/trips';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ModelSelector from '@/components/ModelSelector';

const Explore: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinking, setThinking] = useState<string[] | undefined>(undefined);
  const [showThinking, setShowThinking] = useState(false);
  const [aiModel, setAiModel] = useState<'claude' | 'gemini'>(
    () => (localStorage.getItem('preferredAiModel') as 'claude' | 'gemini') || 'claude'
  );
  const navigate = useNavigate();
  const { toast } = useToast();

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
    setThinking(undefined);
    setTrips([]);
    
    try {
      const response = await generateTrips(prompt);
      
      setTrips(response.trips);
      setThinking(response.thinking);
      
      if (response.thinking && response.thinking.length > 0) {
        setShowThinking(true);
      }
      
      if (response.trips.length === 0) {
        setError("No trips found for your request. Try a different prompt.");
      }
    } catch (err) {
      console.error("Error generating trips:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      
      if (errorMessage.includes("API key is not set") || errorMessage.includes("Edge Function Error")) {
        setError("Could not connect to AI service. Please try again later or contact support.");
      } else {
        setError(errorMessage);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTrip = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const toggleThinking = () => {
    setShowThinking(prev => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-800">Explore Adventures</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">AI Model:</span>
          <ModelSelector compact showLabels={false} onChange={(model) => setAiModel(model)} />
        </div>
      </div>
      
      {thinking && thinking.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={toggleThinking}
            className="text-sm text-purple-600 hover:text-purple-800 underline flex items-center"
          >
            {showThinking ? "Hide AI thinking process" : "Show AI thinking process"}
          </button>
        </div>
      )}
      
      <ThinkingDisplay thinkingSteps={thinking} isVisible={showThinking} />
      
      {loading && (
        <LoadingSpinner message={`Generating adventure recommendations with ${aiModel === 'claude' ? 'Claude' : 'Gemini'}...`} />
      )}
      
      {error && !loading && (
        <ErrorDisplay 
          errorMessage={error}
          onRetry={() => setError(null)}
        />
      )}
      
      {!loading && !error && trips.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Recommended Adventures</h2>
          
          <div className="space-y-8">
            {trips.map((trip, index) => (
              <div key={trip.id || index} className="relative">
                {index < 2 && (
                  <div className="absolute -top-4 -left-2 z-10">
                    <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Option {index + 1}
                    </span>
                  </div>
                )}
                <TripCard 
                  trip={trip} 
                  onExpand={() => handleViewTrip(trip.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && !error && trips.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">No adventures yet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter a prompt above to generate personalized adventure recommendations.
            Try something like "4-day hiking trip in Grand Canyon" or "Weekend kayaking adventure in Seattle".
          </p>
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="container mx-auto max-w-6xl">
          <PromptInput 
            onSubmit={handlePromptSubmit} 
            isProcessing={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Explore;
