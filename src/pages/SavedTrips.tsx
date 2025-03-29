
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import TripCard from '@/components/TripCard';
import { Trip } from '@/types/trips';
import { toast } from '@/hooks/use-toast';

const SavedTrips: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();

  // Load saved trips from localStorage on component mount
  useEffect(() => {
    const savedTripsData = localStorage.getItem('savedTrips');
    if (savedTripsData) {
      try {
        const parsedTrips = JSON.parse(savedTripsData);
        setSavedTrips(parsedTrips);
      } catch (error) {
        console.error('Error parsing saved trips:', error);
        toast({
          title: "Error",
          description: "Could not load your saved trips.",
          variant: "destructive"
        });
      }
    }
  }, []);

  const handleViewTripDetails = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const handleRemoveTrip = (tripId: string) => {
    const updatedTrips = savedTrips.filter(trip => trip.id !== tripId);
    setSavedTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    
    toast({
      title: "Trip Removed",
      description: "The trip has been removed from your saved trips.",
    });
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Saved Adventures</h1>
        <p className="text-gray-600">Your collection of saved adventures for future exploration.</p>
      </div>
      
      {savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {savedTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onExpand={() => handleViewTripDetails(trip.id)}
              showRemoveButton
              onRemove={() => handleRemoveTrip(trip.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No Saved Adventures Yet</h3>
          <p className="text-gray-600 mb-4">
            Explore adventures and save your favorites to see them here.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Discover Adventures
          </button>
        </Card>
      )}
    </div>
  );
};

export default SavedTrips;
