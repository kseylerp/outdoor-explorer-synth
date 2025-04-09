
import React from 'react';
import { Coffee, Utensils } from 'lucide-react';
import { ItineraryDay } from '@/types/trips';

interface MealsSectionProps {
  meals: ItineraryDay['meals'];
}

const MealsSection: React.FC<MealsSectionProps> = ({ meals }) => {
  if (!meals || Object.keys(meals).length === 0) return null;
  
  return (
    <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
      <h5 className="text-md font-medium mb-2 text-amber-800">Meals</h5>
      <div className="space-y-2">
        {meals.breakfast && (
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-amber-700" />
            <p className="text-sm">
              <span className="font-medium">Breakfast:</span> {meals.breakfast}
            </p>
          </div>
        )}
        {meals.lunch && (
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-amber-700" />
            <p className="text-sm">
              <span className="font-medium">Lunch:</span> {meals.lunch}
            </p>
          </div>
        )}
        {meals.dinner && (
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-amber-700" />
            <p className="text-sm">
              <span className="font-medium">Dinner:</span> {meals.dinner}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealsSection;
