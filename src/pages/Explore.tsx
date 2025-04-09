
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
import { Settings } from 'lucide-react';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const Explore: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [thinking, setThinking] = useState<string[] | undefined>(undefined);
  const [showThinking, setShowThinking] = useState(false);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number>(0);
  const [aiModel, setAiModel] = useState<'claude' | 'gemini'>(
    () => (localStorage.getItem('preferredAiModel') as 'claude' | 'gemini') || 'gemini'
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
    setErrorDetails(null);
    setThinking(undefined);
    setTrips([]);
    setSelectedTripIndex(0);
    
    try {
      console.info(`Submitting prompt to generate trips with ${aiModel}: ${prompt}`);
      const result = await generateTrips(prompt, (thinkingSteps) => {
        setThinking(thinkingSteps);
      });
      
      console.info(`Received ${result.length} trips from ${aiModel} API`);
      if (result.length > 0) {
        console.info('First trip data sample:', JSON.stringify(result[0]).substring(0, 300) + '...');
        console.info('Full itinerary length for first trip:', result[0].itinerary?.length || 0);
        
        // Log full itinerary for debugging
        console.info('Complete itinerary for first trip:', JSON.stringify(result[0].itinerary, null, 2));
      }
      
      setTrips(result);
      
      if (thinking && thinking.length > 0) {
        setShowThinking(true);
      }
      
      if (result.length === 0) {
        setError("No trips found for your request. Try a different prompt.");
      }
    } catch (err) {
      console.error("Error generating trips:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      
      if (errorMessage.includes("|")) {
        const [mainError, details] = errorMessage.split("|", 2);
        setError(mainError.trim());
        setErrorDetails(details.trim());
      }
      
      toast({
        title: "Error",
        description: errorMessage.split("|")[0],
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
        <h1 className="text-3xl font-bold text-purple-800 break-words">Explore Adventures</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 hidden md:inline">
            AI Model: {aiModel === 'claude' ? 'Claude' : 'Gemini'}
          </span>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to="/settings">
              <Settings size={16} className="mr-1" />
              AI Settings
            </Link>
          </Button>
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
        <ApiConnectionError 
          customMessage={error}
          errorDetails={errorDetails || undefined}
          onRetry={() => setError(null)}
        />
      )}
      
      {!loading && !error && trips.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Recommended Adventures</h2>
          
          {/* Trip toggle options */}
          <div className="flex justify-center mb-6">
            <ToggleGroup type="single" value={selectedTripIndex.toString()} onValueChange={(value) => {
              if (value) setSelectedTripIndex(parseInt(value));
            }}>
              {trips.map((trip, index) => (
                <ToggleGroupItem 
                  key={index} 
                  value={index.toString()} 
                  aria-label={`Option ${index + 1}`}
                  className="px-5 py-2 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  Option {index + 1}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          
          {/* Display selected trip */}
          {trips[selectedTripIndex] && (
            <div className="w-full max-w-3xl mx-auto">
              <TripCard 
                trip={trips[selectedTripIndex]} 
                onExpand={() => handleViewTrip(trips[selectedTripIndex].id)}
              />
            </div>
          )}
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>These adventures were generated by {aiModel === 'claude' ? 'Claude AI' : 'Google Gemini'}</p>
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
