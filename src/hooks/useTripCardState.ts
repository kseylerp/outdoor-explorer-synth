
import { useState } from 'react';

interface UseTripCardStateProps {
  initialExpanded: boolean;
}

/**
 * Custom hook to manage the state of a trip card
 */
export const useTripCardState = ({ initialExpanded }: UseTripCardStateProps) => {
  const [isItineraryVisible, setIsItineraryVisible] = useState(initialExpanded);
  
  const toggleItinerary = () => setIsItineraryVisible(!isItineraryVisible);
  
  return {
    isItineraryVisible,
    toggleItinerary
  };
};
