
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TripResponseViewer from './TripResponseViewer';
import { generateTrips } from '@/services/trip/tripRecommendationService';
import { useToast } from '@/hooks/use-toast';

const TripResponseContainer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinking, setThinking] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a trip description",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setTripData(null);
    setThinking([]);
    
    try {
      const trips = await generateTrips(prompt, (steps) => {
        setThinking(steps);
      });
      
      if (trips && trips.length > 0) {
        setTripData(trips[0]);
      } else {
        setError("No trip data was generated. Please try again with a different prompt.");
      }
    } catch (err) {
      setError(`Error: ${err.message || 'Something went wrong'}`);
      console.error("Error generating trip:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Trip Generator</h2>
        <div className="space-y-4">
          <Textarea 
            placeholder="Describe your dream trip. For example: A 3-day hiking trip in the Cascade Mountains with scenic views" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handlePromptSubmit}
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? <LoadingSpinner /> : "Generate Trip"}
          </Button>
        </div>
      </Card>
      
      {loading && (
        <div className="text-center p-12">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500">Generating your perfect trip...</p>
          {thinking.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 max-w-xl mx-auto">
              <div className="animate-pulse">
                {thinking[thinking.length - 1]}
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && !loading && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-red-800">{error}</div>
          <Button 
            variant="outline"
            onClick={handlePromptSubmit}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      )}
      
      {tripData && !loading && !error && (
        <TripResponseViewer 
          tripData={tripData} 
          thinking={thinking}
        />
      )}
    </div>
  );
};

export default TripResponseContainer;
