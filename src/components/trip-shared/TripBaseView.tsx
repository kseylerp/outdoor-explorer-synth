
import React from 'react';
import { Trip } from '@/types/trips';
import TripMapSection from '../trip-details/TripMapSection';
import PriceBreakdown from '../trip-details/PriceBreakdown';
import TripHeader from '../trip-details/TripHeader';

interface TripBaseViewProps {
  trip: Trip;
  compact?: boolean;
  children?: React.ReactNode;
}

const TripBaseView: React.FC<TripBaseViewProps> = ({ trip, compact = false, children }) => {
  return (
    <div className="p-6">
      <TripHeader 
        title={trip.title}
        description={trip.description}
        location={trip.location}
        duration={trip.duration}
      />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Map section */}
          <TripMapSection trip={trip} height={compact ? "200px" : "300px"} />
          
          {/* Why we chose this - Display full text */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Why We Chose This
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{trip.whyWeChoseThis}</p>
          </div>

          {/* Render children (typically ItineraryTab component) */}
          {!compact && children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
        
        {/* Price breakdown */}
        <div className="space-y-6">
          <PriceBreakdown 
            totalPrice={trip.priceEstimate} 
            compact={compact}
            priceDetails={trip.priceBreakdown}
          />
          
          {/* Additional information that might be useful */}
          {trip.bestTimeToVisit && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-md font-semibold text-blue-900 mb-1">
                Best Time to Visit
              </h3>
              <p className="text-gray-700">{trip.bestTimeToVisit}</p>
            </div>
          )}
          
          {trip.permits && trip.permits.required && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h3 className="text-md font-semibold text-amber-900 mb-1">
                Permits
              </h3>
              <p className="text-gray-700">{trip.permits.details}</p>
            </div>
          )}
          
          {/* Equipment recommendations if available */}
          {trip.equipmentRecommendations && trip.equipmentRecommendations.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-md font-semibold mb-2">
                Equipment Recommendations
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {trip.equipmentRecommendations.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripBaseView;
