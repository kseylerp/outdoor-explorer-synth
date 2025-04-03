
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/types/trips';

interface ActivityCardProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isLast }) => {
  return (
    <div className="relative">
      <Card className="border-l-4 border-l-purple-400 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-semibold text-purple-700">{activity.name || 'Unnamed Activity'}</h5>
            <Badge variant="outline" className="bg-purple-50">{activity.duration || 'Duration unknown'}</Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{activity.description || 'No description available'}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{activity.type || 'Other'}</Badge>
            {activity.permitRequired && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                Permit Required
              </Badge>
            )}
          </div>
          
          {activity.permitDetails && (
            <div className="mb-2 text-sm">
              <span className="font-medium">Permit Details: </span>
              <span className="text-gray-600">{activity.permitDetails}</span>
            </div>
          )}
          
          {activity.outfitters && activity.outfitters.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Suggested Outfitters: </span>
              <span className="text-gray-600">{activity.outfitters.join(', ')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityCard;
