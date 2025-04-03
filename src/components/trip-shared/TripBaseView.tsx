
import React from 'react';
import { Trip } from '@/types/trips';
import TripHeader from '@/components/trip-details/TripHeader';
import PriceBreakdown from '@/components/trip-details/PriceBreakdown';
import TripDescription from '@/components/trip-details/TripDescription';
import TripMapSection from '@/components/trip-details/TripMapSection';

export interface TripBaseProps {
  trip: Trip;
  mapHeight?: string;
  compact?: boolean;
  children?: React.ReactNode;
}

const TripBaseView: React.FC<TripBaseProps> = ({ 
  trip, 
  mapHeight = '200px',
  compact = false,
  children 
}) => {
  return (
    <div className="w-full">
      {/* Header is shared between both views */}
      <TripHeader 
        trip={trip} 
        compact={compact}
      />
      
      <div className="p-6">
        {/* Map and Basic Info Section */}
        <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : ''} gap-6 mb-6`}>
          {compact ? (
            <>
              <div style={{ height: mapHeight }}>
                <TripMapSection trip={trip} height={mapHeight} />
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <PriceBreakdown totalPrice={trip.priceEstimate} compact={compact} />
                </div>
                <TripDescription 
                  description={trip.description}
                  whyWeChoseThis={trip.whyWeChoseThis}
                  suggestedGuides={trip.suggestedGuides}
                  compact={compact}
                />
              </div>
            </>
          ) : (
            <>
              {/* Full layout for detailed view */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PriceBreakdown totalPrice={trip.priceEstimate} />
                <div className="flex items-center justify-center">
                  {/* Additional info panel for detailed view */}
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 w-full">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Trip Summary</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Location:</span> {trip.location}</p>
                      <p><span className="font-medium">Duration:</span> {trip.duration}</p>
                      <p><span className="font-medium">Difficulty:</span> {trip.difficultyLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <TripDescription 
                description={trip.description}
                whyWeChoseThis={trip.whyWeChoseThis}
                suggestedGuides={trip.suggestedGuides}
              />
              
              <TripMapSection trip={trip} height="300px" />
            </>
          )}
        </div>
        
        {/* Render any additional content passed as children */}
        {children}
      </div>
    </div>
  );
};

export default TripBaseView;
