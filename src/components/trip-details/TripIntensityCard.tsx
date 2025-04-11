
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge } from 'lucide-react';
import TripIntensityBar from '@/components/TripIntensityBar';

interface TripIntensityCardProps {
  difficultyLevel: string;
}

const TripIntensityCard: React.FC<TripIntensityCardProps> = ({ difficultyLevel }) => {
  // Convert difficulty level to numeric intensity value (0-100)
  const difficultyToIntensity = (difficulty: string): number => {
    const difficultyMap: Record<string, number> = {
      'Easy': 0,
      'Moderate': 25,
      'Challenging': 50,
      'Intense': 75,
      'Extreme': 100
    };
    
    return difficultyMap[difficulty] ?? 50; // Default to middle if unknown
  };

  return (
    <Card className="border border-purple-100">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Trip Intensity</h3>
        </div>
        <TripIntensityBar 
          level={difficultyToIntensity(difficultyLevel)} 
          readOnly={true} 
        />
        <p className="text-sm text-gray-500 mt-2">Based on terrain, activities, and required fitness level</p>
      </CardContent>
    </Card>
  );
};

export default TripIntensityCard;
