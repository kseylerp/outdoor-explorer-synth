
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import { generateTrips } from '@/services/tripService';
import { Trip } from '@/types/trips';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import ThinkingVisualization from '@/components/ThinkingVisualization';

interface ThinkingStep {
  text: string;
  timestamp: string;
}

const Explore: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const promptInputRef = useRef<HTMLDivElement>(null);

  // Scroll to prompt input when trips are loaded
  useEffect(() => {
    if (trips.length > 0 && promptInputRef.current) {
      promptInputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trips]);

  const handlePromptSubmit = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setThinkingSteps([]);
    
    try {
      const response = await generateTrips(prompt);
      
      // Set trips and thinking steps
      if (response && response.trips && Array.isArray(response.trips)) {
        setTrips(response.trips);
        setThinkingSteps(response.thinking || []);
        
        if (response.trips.length === 0) {
          setError("No trips found for your request. Try a different prompt.");
        }
      } else {
        throw new Error("Invalid response format from the API");
      }
    } catch (err) {
      console.error("Error generating trips:", err);
      setError(err instanceof Error ? err.message : "Failed to generate trip recommendations");
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModifyTrips = async (prompt: string) => {
    if (!trips.length) {
      // If no existing trips, just generate new ones
      handlePromptSubmit(prompt);
      return;
    }
    
    setLoading(true);
    setError(null);
    setThinkingSteps([]);
    
    try {
      // Pass existing trips for context
      const response = await generateTrips(prompt, trips);
      
      // Set trips and thinking steps
      if (response && response.trips && Array.isArray(response.trips)) {
        setTrips(response.trips);
        setThinkingSteps(response.thinking || []);
        
        if (response.trips.length === 0) {
          setError("No trips found for your request. Try a different prompt.");
        }
      } else {
        throw new Error("Invalid response format from the API");
      }
    } catch (err) {
      console.error("Error modifying trips:", err);
      setError(err instanceof Error ? err.message : "Failed to modify trip recommendations");
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTrip = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Show header only when not loading or if there are no existing trips */}
      {(!loading || trips.length === 0) && (
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Explore Adventures</h1>
      )}
      
      {/* Show prompt input at the top only when starting fresh */}
      {trips.length === 0 && (
        <div className="mb-8">
          <PromptInput 
            onSubmit={handlePromptSubmit} 
            isProcessing={loading} 
          />
        </div>
      )}
      
      {/* Show thinking visualization when loading */}
      {loading && (
        <ThinkingVisualization 
          thinkingSteps={thinkingSteps} 
          isVisible={loading} 
        />
      )}
      
      {/* Show regular loading spinner as fallback */}
      {loading && thinkingSteps.length === 0 && (
        <LoadingSpinner message="Generating adventure recommendations..." />
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
      
      {/* Persistent prompt input at the bottom */}
      {trips.length > 0 && (
        <div 
          ref={promptInputRef}
          className="sticky bottom-4 bg-white rounded-lg shadow-lg p-4 mt-8 border border-gray-200 z-10"
        >
          <PromptInput 
            onSubmit={handleModifyTrips}
            isProcessing={loading}
            placeholder="Modify these trips or generate new ones..."
          />
        </div>
      )}
    </div>
  );
};

export default Explore;
