
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, MapPin, Mountain } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { generateTrips } from '@/services/tripService';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/TripCard';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTripSelect = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      setIsProcessing(true);
      setTrips([]);
      setExpandedTripId(null);
      
      // Show a loading toast
      toast({
        title: 'Planning your adventure',
        description: 'Our AI is crafting the perfect outdoor experience for you...',
      });
      
      // Fetch trip suggestions from the AI
      const suggestedTrips = await generateTrips(prompt);
      
      // Success toast
      toast({
        title: 'Adventure plans ready!',
        description: `We've created ${suggestedTrips.length} personalized adventure options for you.`,
      });
      
      setTrips(suggestedTrips);
    } catch (error) {
      console.error('Error generating trips:', error);
      
      // Error toast
      toast({
        title: 'Something went wrong',
        description: 'We couldn\'t generate your adventure plans. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header & Hero Section */}
      <header className="pt-12 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-2">
              Discover, Plan, and Share Your Next Adventure
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Powered by Local Guides
            </p>
          </div>
          
          <Card className="bg-white/90 backdrop-blur shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Plan Your Adventure
              </CardTitle>
              <CardDescription>
                Describe your ideal outdoor experience, and we'll create a personalized adventure plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptInput onSubmit={handlePromptSubmit} isProcessing={isProcessing} />
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Trip Results Section */}
      <main className="container mx-auto max-w-5xl px-4 pb-20">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Crafting your adventure plans...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Your Adventure Options</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {trips.map((trip) => (
                <div key={trip.id} onClick={() => handleTripSelect(trip.id)} className="cursor-pointer transform transition-transform hover:scale-[1.01]">
                  <TripCard 
                    trip={trip} 
                    expanded={expandedTripId === trip.id}
                    onExpand={() => setExpandedTripId(trip.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">Your adventure plans will appear here...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
