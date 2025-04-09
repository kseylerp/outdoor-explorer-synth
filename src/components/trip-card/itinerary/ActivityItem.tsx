
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { Activity } from '@/types/trips';

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-purple-900 break-words">
          {activity.name || 'Unnamed Activity'}
        </h4>
        {activity.duration && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {activity.duration}
          </Badge>
        )}
      </div>
      
      {activity.description && (
        <p className="text-sm text-gray-600 mt-2">
          {activity.description}
        </p>
      )}
      
      <div className="mt-3 flex flex-wrap gap-2">
        {activity.type && (
          <Badge variant="outline" className="bg-purple-50 text-purple-800">
            {activity.type}
          </Badge>
        )}
        
        {activity.permitRequired && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 font-medium">
            Permit Required
          </Badge>
        )}

        {activity.location && (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-800">
            <MapPin className="h-3 w-3" />
            {activity.location}
          </Badge>
        )}
      </div>
      
      {activity.permitDetails && (
        <div className="mt-3 text-sm">
          <span className="font-medium">Permit Details: </span>
          <span className="text-gray-600">{activity.permitDetails}</span>
        </div>
      )}
      
      {activity.outfitters && activity.outfitters.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="font-medium">Suggested Outfitters: </span>
          <span className="text-gray-600">{activity.outfitters.join(', ')}</span>
        </div>
      )}

      {activity.equipmentNeeded && activity.equipmentNeeded.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="font-medium">Equipment Needed: </span>
          <span className="text-gray-600">{activity.equipmentNeeded.join(', ')}</span>
        </div>
      )}

      {activity.difficulty && (
        <div className="mt-3 text-sm">
          <span className="font-medium">Difficulty: </span>
          <span className="text-gray-600">{activity.difficulty}</span>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
