
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/types/trips';
import { MapPin, Thermometer, ShieldAlert, Waves, Compass } from 'lucide-react';

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
            {activity.difficulty && (
              <Badge variant="outline" className={`bg-${
                activity.difficulty.toLowerCase() === 'easy' ? 'green' : 
                activity.difficulty.toLowerCase() === 'moderate' ? 'blue' : 
                activity.difficulty.toLowerCase() === 'difficult' ? 'orange' : 'red'
              }-100 text-${
                activity.difficulty.toLowerCase() === 'easy' ? 'green' : 
                activity.difficulty.toLowerCase() === 'moderate' ? 'blue' : 
                activity.difficulty.toLowerCase() === 'difficult' ? 'orange' : 'red'
              }-800`}>
                {activity.difficulty}
              </Badge>
            )}
          </div>
          
          {/* Additional Activity Details */}
          <div className="space-y-2 mb-3">
            {activity.location && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-gray-700">{activity.location}</p>
              </div>
            )}
            
            {activity.weather && (
              <div className="flex items-start gap-2 text-sm">
                <Thermometer className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-gray-700">{activity.weather}</p>
              </div>
            )}
            
            {activity.price && (
              <div className="flex items-start gap-2 text-sm">
                <p className="font-medium">Price:</p>
                <p className="text-gray-700">
                  {typeof activity.price === 'number' 
                    ? `$${activity.price.toLocaleString()}` 
                    : activity.price}
                </p>
              </div>
            )}
          </div>
          
          {/* Equipment Needed */}
          {activity.equipmentNeeded && activity.equipmentNeeded.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <Compass className="h-4 w-4 text-gray-700" />
                <p className="text-sm font-medium">Equipment Needed:</p>
              </div>
              <ul className="text-sm text-gray-600 pl-6 list-disc">
                {activity.equipmentNeeded.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {activity.permitDetails && (
            <div className="mb-2 text-sm">
              <div className="flex items-center gap-1 mb-1">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span className="font-medium">Permit Details:</span>
              </div>
              <span className="text-gray-600 pl-6">{activity.permitDetails}</span>
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
