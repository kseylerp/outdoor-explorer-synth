
import React from 'react';
import { Trip } from '@/types/trips';
import TripCard from '@/components/trip-card';
import { useToast } from '@/hooks/use-toast';
import ApiConnectionError from '@/components/common/ApiConnectionError';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThinkingDisplay from '@/components/ThinkingDisplay';

interface TripResultsProps {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  errorDetails: string | null;
  thinking?: string[];
  showThinking: boolean;
  onRetry: () => void;
  onSaveTrip: (trip: Trip) => void;
}

const TripResults: React.FC<TripResultsProps> = ({
  trips,
  loading,
  error,
  errorDetails,
  thinking,
  showThinking,
  onRetry,
  onSaveTrip
}) => {
  if (error && !error.includes('API key')) {
    return (
      <ApiConnectionError 
        customMessage={error}
        errorDetails={errorDetails || undefined}
        onRetry={onRetry}
      />
    );
  }

  if (loading) {
    return (
      <div className="mb-8">
        <LoadingSpinner />
        {thinking && thinking.length > 0 && <ThinkingDisplay thinkingSteps={thinking} isVisible={showThinking} />}
      </div>
    );
  }

  if (trips.length > 0) {
    return (
      <div className="space-y-8">
        {trips.map((trip, index) => (
          <div key={trip.id || `trip-${index}`} className="relative">
            {trips.length > 1 && (
              <div className="absolute -top-4 -left-2 z-10">
                <span className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Option {index + 1}
                </span>
              </div>
            )}
            <TripCard 
              trip={trip}
              onSave={() => onSaveTrip(trip)}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default TripResults;
