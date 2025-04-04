
import React from 'react';
import { Journey } from '@/types/trips';

interface JourneyInfoProps {
  journey: Journey;
}

const JourneyInfo: React.FC<JourneyInfoProps> = ({ journey }) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} meters`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${minutes} min`;
  };

  return (
    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <h4 className="text-md font-medium mb-3">Journey Overview</h4>
      <div className="space-y-3">
        <p><span className="font-medium">Total Distance:</span> {formatDistance(journey.totalDistance)}</p>
        <p><span className="font-medium">Total Duration:</span> {formatDuration(journey.totalDuration)}</p>
        {journey.segments.length > 0 && (
          <div>
            <h5 className="font-medium mt-3 mb-2">Segments:</h5>
            <div className="space-y-2">
              {journey.segments.map((segment, idx) => (
                <div key={idx} className="bg-white p-3 rounded border border-slate-100">
                  <p className="font-medium text-purple-700">{segment.from} → {segment.to}</p>
                  <p className="text-sm">
                    <span className="capitalize">{segment.mode}</span> • {formatDistance(segment.distance)} • {formatDuration(segment.duration)}
                  </p>
                  {segment.elevationGain && (
                    <p className="text-sm">Elevation Gain: {segment.elevationGain}m</p>
                  )}
                  {segment.terrain && (
                    <p className="text-sm">Terrain: {segment.terrain}</p>
                  )}
                  {segment.description && (
                    <p className="text-sm mt-1 text-gray-600">{segment.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyInfo;
