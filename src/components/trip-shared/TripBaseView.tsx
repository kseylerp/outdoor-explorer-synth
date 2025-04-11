
import React from 'react';
import { Trip } from '@/types/trips';
import TripMapSection from '../trip-details/TripMapSection';
import PriceBreakdown from '../trip-details/PriceBreakdown';
import TripHeader from '../trip-details/TripHeader';
import TripDescription from '../trip-details/TripDescription';
import TripIntensityCard from '../trip-details/TripIntensityCard';

interface TripBaseViewProps {
  trip: Trip;
  compact?: boolean;
  children?: React.ReactNode;
  onSave?: () => void;
  isSaved?: boolean;
}

const TripBaseView: React.FC<TripBaseViewProps> = ({ 
  trip, 
  compact = false, 
  children,
  onSave,
  isSaved = false
}) => {
  // Add console logging to debug the trip data
  console.log('TripBaseView - trip data:', trip);
  
  return (
    <div className="p-6">
      <TripHeader 
        trip={trip}
        compact={compact}
        onSave={onSave}
        isSaved={isSaved}
      />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map and description - now spans 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-6">
          {/* Map section */}
          <TripMapSection trip={trip} height={compact ? "200px" : "300px"} />
          
          {/* Trip description with "Why We Chose This" */}
          <TripDescription 
            description={trip.description}
            whyWeChoseThis={trip.whyWeChoseThis}
            suggestedGuides={trip.suggestedGuides}
            bestTimeToVisit={trip.bestTimeToVisit}
            seasonalInfo={trip.weatherInfo}
            highlights={trip.highlights}
            compact={compact}
          />
        </div>
        
        {/* Price breakdown and additional info section - now spans 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          <PriceBreakdown 
            totalPrice={trip.priceEstimate} 
            compact={compact}
            priceDetails={trip.priceBreakdown}
          />
          
          {/* Trip intensity card */}
          {!compact && <TripIntensityCard difficultyLevel={trip.difficultyLevel} />}
          
          {/* Best Time to Visit info */}
          {trip.bestTimeToVisit && !compact && (
            <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <h3 className="text-md font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Best Time to Visit
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{trip.bestTimeToVisit}</p>
            </div>
          )}
          
          {/* Permits info */}
          {trip.permits && trip.permits.required && (
            <div className="bg-amber-50 dark:bg-gray-800 rounded-lg p-4 border border-amber-100 dark:border-gray-700">
              <h3 className="text-md font-semibold text-amber-900 dark:text-amber-300 mb-1">
                Permits
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{trip.permits.details}</p>
            </div>
          )}
          
          {/* Equipment recommendations if available */}
          {trip.equipmentRecommendations && trip.equipmentRecommendations.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold mb-2 dark:text-gray-200">
                Equipment Recommendations
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {trip.equipmentRecommendations.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Local Tips section */}
          {trip.localTips && trip.localTips.length > 0 && (
            <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-gray-700">
              <h3 className="text-md font-semibold text-green-900 dark:text-green-300 mb-2">
                Local Tips
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {trip.localTips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Safety Notes */}
          {trip.safetyNotes && (
            <div className="bg-red-50 dark:bg-gray-800 rounded-lg p-4 border border-red-100 dark:border-gray-700">
              <h3 className="text-md font-semibold text-red-900 dark:text-red-300 mb-1">
                Safety Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{trip.safetyNotes}</p>
            </div>
          )}
        </div>

        {/* Children (typically the ItineraryTab component) below in full width */}
        {children && (
          <div className="lg:col-span-12 mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripBaseView;
