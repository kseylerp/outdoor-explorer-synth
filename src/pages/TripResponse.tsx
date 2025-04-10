
import React from 'react';
import TripResponseContainer from '@/components/trip-response/TripResponseContainer';

const TripResponsePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-purple-800">Trip Response Builder</h1>
      <p className="mb-6 text-gray-600">
        Generate custom trip itineraries using the power of AI. 
        Our system creates travel plans optimized for less crowded, locally-oriented, and environmentally-friendly experiences.
      </p>
      
      <TripResponseContainer />
    </div>
  );
};

export default TripResponsePage;
