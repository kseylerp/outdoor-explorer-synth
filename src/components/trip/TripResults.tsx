
import React from 'react';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import { Trip } from '@/types/trips';

interface TripResultsProps {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  errorDetails: string | null;
  thinking: string[] | undefined;
  handleRetryConnection: () => void;
  handleSaveTrip: (trip: Trip) => void;
}

const TripResults: React.FC<TripResultsProps> = ({
  trips,
  loading,
  error,
  errorDetails,
  thinking,
  handleRetryConnection,
  handleSaveTrip
}) => {
  if (error) {
    return (
      <ApiConnectionError 
        customMessage={error} 
        errorDetails={errorDetails || undefined} 
        onRetry={handleRetryConnection} 
      />
    );
  }

  if (loading) {
    return (
      <div className="mb-8">
        <LoadingSpinner />
        {thinking && thinking.length > 0 && (
          <ThinkingDisplay thinkingSteps={thinking} isVisible={true} />
        )}
      </div>
    );
  }

  if (trips.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 mb-8">
      {trips.map((trip, index) => (
        <div key={trip.id || `trip-${index}`} className="relative">
          {trips.length > 1 && (
            <div className="absolute -top-4 -left-2 z-10">
              <span className="bg-[#65558F] text-white text-sm font-medium px-3 py-1 rounded-full">
                Option {index + 1}
              </span>
            </div>
          )}
          <TripCard trip={trip} onSave={() => handleSaveTrip(trip)} />
        </div>
      ))}
    </div>
  );
};

export default TripResults;
