
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import { generateTrips } from '@/services/tripService';
import { Trip } from '@/types/trips';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const Explore: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePromptSubmit = async (prompt: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateTrips(prompt);
      
      // Handle the response which should directly be an array of Trip objects
      if (response && Array.isArray(response)) {
        setTrips(response);
        
        if (response.length === 0) {
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

  const handleViewTrip = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Explore Adventures</h1>
      
      <div className="mb-8">
        <PromptInput 
          onSubmit={handlePromptSubmit} 
          isProcessing={loading} 
        />
      </div>
      
      {loading && (
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
    </div>
  );
};

export default Explore;
