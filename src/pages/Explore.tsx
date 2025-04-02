import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trip } from '@/types/trips';
import PromptInput from '@/components/PromptInput';
import TripCard from '@/components/trip-card';
import CostRegister from '@/components/CostRegister';

const Explore: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedTrips, setSavedTrips] = useState<string[]>([]);
  const [activeTrip, setActiveTrip] = useState<string>("0");
  
  // Cost tracking state
  const [costTracking, setCostTracking] = useState({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
    inputCostPer1k: 0.00375,
    outputCostPer1k: 0.01125
  });

  // Load saved trips from localStorage
  useEffect(() => {
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (savedTripsJson) {
      try {
        const parsedTrips = JSON.parse(savedTripsJson);
        const tripIds = parsedTrips.map((trip: Trip) => trip.id);
        setSavedTrips(tripIds);
      } catch (error) {
        console.error('Error parsing saved trips:', error);
      }
    }
  }, []);

  const handlePromptSubmit = async (prompt: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('trip-recommendations', {
        body: { prompt }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.trip && Array.isArray(data.trip)) {
        setTrips(data.trip);
        
        // Set active trip to first one
        if (data.trip.length > 0) {
          setActiveTrip("0");
        }
        
        // Update cost tracking
        if (data.costTracking) {
          setCostTracking({
            promptTokens: data.costTracking.promptTokens || 0,
            completionTokens: data.costTracking.completionTokens || 0,
            totalTokens: data.costTracking.totalTokens || 0,
            estimatedCost: data.costTracking.estimatedCost || 0,
            inputCostPer1k: data.costTracking.inputCostPer1k || 0.00375,
            outputCostPer1k: data.costTracking.outputCostPer1k || 0.01125
          });
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: 'Error',
        description: 'Could not get trip recommendations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = (tripIndex: number) => {
    const tripToSave = trips[tripIndex];
    if (!tripToSave) return;
    
    // Already saved?
    if (savedTrips.includes(tripToSave.id)) {
      toast({
        title: 'Already Saved',
        description: 'This trip is already in your saved trips',
      });
      return;
    }
    
    // Get existing saved trips
    const savedTripsJson = localStorage.getItem('savedTrips');
    let existingSavedTrips: Trip[] = [];
    
    if (savedTripsJson) {
      try {
        existingSavedTrips = JSON.parse(savedTripsJson);
      } catch (e) {
        console.error('Error parsing saved trips:', e);
      }
    }
    
    // Add new trip and save back to localStorage
    existingSavedTrips.push(tripToSave);
    localStorage.setItem('savedTrips', JSON.stringify(existingSavedTrips));
    
    // Update saved trip IDs
    setSavedTrips(prev => [...prev, tripToSave.id]);
    
    toast({
      title: 'Trip Saved',
      description: 'This trip has been added to your saved trips',
    });
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore New Adventures</h1>
        <p className="text-gray-600 mb-6">
          Describe your ideal outdoor adventure, and we'll recommend eco-friendly trips 
          that match your preferences. Try specifying a location, activity type, or duration.
        </p>
        
        <Card>
          <CardContent className="pt-6">
            <PromptInput onSubmit={handlePromptSubmit} isProcessing={loading} />
          </CardContent>
        </Card>
      </div>
      
      {loading ? (
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-[200px] w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ) : trips.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTrip} onValueChange={setActiveTrip}>
            <TabsList className="mb-6">
              {trips.map((_, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()}
                  className="min-w-[120px] data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Option {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {trips.map((trip, index) => (
              <TabsContent key={index} value={index.toString()}>
                <TripCard 
                  trip={trip} 
                  isSaved={savedTrips.includes(trip.id)}
                  onSave={() => handleSaveTrip(index)}
                />
              </TabsContent>
            ))}
          </Tabs>
          
          {/* Cost register component */}
          <CostRegister 
            totalTokensUsed={costTracking.totalTokens}
            tokenCostRate={costTracking.outputCostPer1k / 1000}
            totalCost={costTracking.estimatedCost}
          />
        </div>
      ) : null}
      
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-500 mb-4">Looking for your saved trips?</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/saved-trips"}
        >
          View Saved Trips
        </Button>
      </div>
    </div>
  );
};

export default Explore;
