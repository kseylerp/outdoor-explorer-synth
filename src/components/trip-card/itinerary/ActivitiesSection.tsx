
import React from 'react';
import { Activity } from '@/types/trips';
import ActivityItem from './ActivityItem';

interface ActivitiesSectionProps {
  activities: Activity[];
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="mt-4 text-center p-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">No activities listed for this day</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity, actIdx) => (
        <ActivityItem 
          key={`activity-${actIdx}`} 
          activity={activity} 
        />
      ))}
    </div>
  );
};

export default ActivitiesSection;
