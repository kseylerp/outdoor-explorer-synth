
import React from 'react';
import { Activity } from '@/types/trips';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, ChevronUp, Mountain, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ActivityCardProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isLast }) => {
  return (
    <Card className="border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-purple-900">
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
            <p className="text-sm text-gray-700 mt-2">
              {activity.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {/* Activity type */}
            {activity.type && (
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-purple-700" />
                <span className="text-sm">{activity.type}</span>
              </div>
            )}
            
            {/* Location if available */}
            {activity.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-700" />
                <span className="text-sm">{activity.location}</span>
              </div>
            )}
            
            {/* Distance if available */}
            {activity.distance && (
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-purple-700" />
                <span className="text-sm">
                  Distance: {typeof activity.distance === 'number' 
                    ? `${(activity.distance / 1000).toFixed(1)} km` 
                    : activity.distance}
                </span>
              </div>
            )}
            
            {/* Elevation gain if available */}
            {activity.elevation && (
              <div className="flex items-center gap-2">
                <ChevronUp className="h-4 w-4 text-purple-700" />
                <span className="text-sm">
                  Elevation gain: {typeof activity.elevation === 'number' 
                    ? `${activity.elevation} m` 
                    : activity.elevation}
                </span>
              </div>
            )}
            
            {/* Difficulty if available */}
            {activity.difficulty && (
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4 text-purple-700" />
                <span className="text-sm">Difficulty: {activity.difficulty}</span>
              </div>
            )}
          </div>
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
