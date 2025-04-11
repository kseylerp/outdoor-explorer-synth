
import React from 'react';

interface TripIntensityBarProps {
  level: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const TripIntensityBar: React.FC<TripIntensityBarProps> = ({ 
  level, 
  onChange,
  readOnly = false 
}) => {
  const intensityLabels = ['Easy', 'Moderate', 'Challenging', 'Intense', 'Extreme'];
  
  // Calculate which label to use based on level
  const labelIndex = Math.floor((level / 100) * (intensityLabels.length - 1));
  const intensityLabel = intensityLabels[labelIndex];
  
  // Define color classes based on intensity level
  const getColorClass = () => {
    if (labelIndex === 0) return "text-green-500 dark:text-green-400";
    if (labelIndex === 1) return "text-blue-500 dark:text-blue-400";
    if (labelIndex === 2) return "text-amber-500 dark:text-amber-400"; 
    if (labelIndex === 3) return "text-orange-500 dark:text-orange-400";
    return "text-red-500 dark:text-red-400";
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-yugen-purple dark:text-yugen-bright font-semibold text-sm">Activity intensity</span>
        <span className={`font-medium text-sm ${getColorClass()}`}>
          {intensityLabel}
        </span>
      </div>
    </div>
  );
};

export default TripIntensityBar;
