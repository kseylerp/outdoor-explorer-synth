
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TripDetailsComponent from '@/components/TripDetails';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';
import { fetchTripById } from '@/services/trip/tripService';

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        if (!id) {
          setError("Trip ID is missing");
          setLoading(false);
          return;
        }

        setLoading(true);
        const tripData = await fetchTripById(id);
        
        if (!tripData) {
          setError("Trip not found");
          setLoading(false);
          return;
        }

        setTrip(tripData);
        setError(null);
      } catch (error) {
        console.error("Error loading trip:", error);
        setError("Failed to load trip details");
        
        toast({
          title: "Error Loading Trip",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, navigate]);

  // Function to handle retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Force cache miss by adding a timestamp parameter
    fetchTripById(id as string)
      .then(tripData => {
        if (!tripData) {
          setError("Trip not found");
          return;
        }
        setTrip(tripData);
        setError(null);
      })
      .catch(err => {
        console.error("Error retrying trip load:", err);
        setError("Failed to load trip details on retry");
        toast({
          title: "Error on Retry",
          description: err instanceof Error ? err.message : "Unknown error occurred",
          variant: "destructive"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Adventures
      </Button>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading trip details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Trip</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button onClick={handleRetry} variant="default">
              Retry Loading
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Return to Adventures
            </Button>
          </div>
        </div>
      ) : trip ? (
        <TripDetailsComponent trip={trip} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            Return to Adventures
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
