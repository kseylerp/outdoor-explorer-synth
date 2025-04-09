
import React from 'react';
import { Activity } from '@/types/trips';
import ActivityCard from './ActivityCard';

interface ActivitySectionProps {
  activities: Activity[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500 text-center p-4">No activities available for this day.</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <ActivityCard 
          key={idx} 
          activity={activity} 
          isLast={idx === activities.length - 1} 
        />
      ))}
    </div>
  );
};

export default ActivitySection;
