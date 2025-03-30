
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TripDetailsComponent from '@/components/TripDetails';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';
import { fetchTripById } from '@/services/trip/tripService';
import BackButton from '@/components/navigation/BackButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import NotFound from '@/components/common/NotFound';

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
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

  const handleNavigateHome = () => navigate('/');

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <BackButton onClick={handleNavigateHome} />
      
      {loading ? (
        <LoadingSpinner message="Loading trip details..." />
      ) : error ? (
        <ErrorDisplay 
          errorMessage={error} 
          onRetry={handleRetry} 
          onReturn={handleNavigateHome} 
        />
      ) : trip ? (
        <TripDetailsComponent trip={trip} />
      ) : (
        <NotFound onReturn={handleNavigateHome} />
      )}
    </div>
  );
};

export default TripDetailsPage;
