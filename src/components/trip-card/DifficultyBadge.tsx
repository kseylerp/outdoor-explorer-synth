
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DifficultyBadgeProps {
  level: string;
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level }) => {
  const lowerLevel = level.toLowerCase();
  
  // Determine color based on difficulty level
  const getColorClass = () => {
    if (lowerLevel.includes('easy')) {
      return 'bg-green-500 hover:bg-green-600';
    } else if (lowerLevel.includes('moderate')) {
      return 'bg-yellow-500 hover:bg-yellow-600';
    } else if (lowerLevel.includes('challenging') || lowerLevel.includes('difficult')) {
      return 'bg-orange-500 hover:bg-orange-600';
    } else if (lowerLevel.includes('extreme') || lowerLevel.includes('hard')) {
      return 'bg-red-500 hover:bg-red-600';
    }
    // Default purple for other cases
    return 'bg-[#9870FF] hover:bg-purple-700';
  };

  return (
    <Badge className={`${getColorClass()} text-white`}>
      {level}
    </Badge>
  );
};

export default DifficultyBadge;
