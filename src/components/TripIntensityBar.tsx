
import React from 'react';
import { Slider } from '@/components/ui/slider';

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
  
  const handleChange = (value: number[]) => {
    if (!readOnly && onChange) {
      onChange(value[0]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-yugen-purple font-semibold text-sm">Activity intensity level</span>
        <span className="bg-yugen-bright/10 text-yugen-bright font-medium px-2 py-0.5 text-xs rounded-full">
          {intensityLabels[Math.floor((level / 100) * (intensityLabels.length - 1))]}
        </span>
      </div>
      
      <div className="trip-intensity-slider">
        <Slider
          value={[level]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleChange}
          disabled={readOnly}
          className={`trip-intensity-track ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        {intensityLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="h-1 w-1 bg-gray-300 rounded-full mb-1"></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripIntensityBar;
