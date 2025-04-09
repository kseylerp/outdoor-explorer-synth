
import React, { useState } from 'react';
import { Activity } from '@/types/trips';
import { Clock, AlertTriangle, Map, ArrowUpRight, Mountain, Droplets, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActivityCardProps {
  activity: Activity;
  isLast?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isLast = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hiking':
        return <Mountain className="h-5 w-5 text-green-600" />;
      case 'sightseeing':
        return <Map className="h-5 w-5 text-blue-600" />;
      case 'dining':
        return <Droplets className="h-5 w-5 text-amber-600" />;
      case 'accommodation':
        return <Home className="h-5 w-5 text-purple-600" />;
      case 'transportation':
        return <ArrowUpRight className="h-5 w-5 text-gray-600" />;
      default:
        return <Map className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="p-4 relative">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium">{activity.name}</h5>
              <div className="flex gap-2 flex-wrap mt-1">
                <Badge variant="outline" className="bg-gray-50">
                  <Clock className="h-3 w-3 mr-1" /> {activity.duration}
                </Badge>
                <Badge variant="outline" className={
                  activity.type.toLowerCase() === 'hiking' ? 'bg-green-50 text-green-700' :
                  activity.type.toLowerCase() === 'sightseeing' ? 'bg-blue-50 text-blue-700' :
                  activity.type.toLowerCase() === 'dining' ? 'bg-amber-50 text-amber-700' :
                  activity.type.toLowerCase() === 'accommodation' ? 'bg-purple-50 text-purple-700' :
                  'bg-gray-50 text-gray-700'
                }>
                  {activity.type}
                </Badge>
                
                {activity.difficulty && (
                  <Badge variant="outline" className={
                    activity.difficulty.toLowerCase() === 'easy' ? 'bg-green-50 text-green-700' :
                    activity.difficulty.toLowerCase() === 'moderate' ? 'bg-blue-50 text-blue-700' :
                    activity.difficulty.toLowerCase() === 'challenging' ? 'bg-amber-50 text-amber-700' :
                    activity.difficulty.toLowerCase() === 'difficult' ? 'bg-red-50 text-red-700' :
                    'bg-gray-50 text-gray-700'
                  }>
                    {activity.difficulty}
                  </Badge>
                )}
              </div>
            </div>
            
            {activity.permitRequired && (
              <div className="ml-auto">
                <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Permit Required
                </Badge>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 text-sm mt-2">{activity.description}</p>
          
          {/* Expanded details */}
          {expanded && (
            <div className="mt-4 space-y-3">
              {activity.location && (
                <div>
                  <h6 className="text-sm font-medium flex items-center gap-1">
                    <Map className="h-3 w-3" /> Location
                  </h6>
                  <p className="text-sm text-gray-700">{activity.location}</p>
                </div>
              )}
              
              {activity.distance && (
                <div>
                  <h6 className="text-sm font-medium">Distance</h6>
                  <p className="text-sm text-gray-700">{activity.distance}</p>
                </div>
              )}
              
              {activity.elevation && (
                <div>
                  <h6 className="text-sm font-medium">Elevation</h6>
                  <p className="text-sm text-gray-700">{activity.elevation}</p>
                </div>
              )}
              
              {activity.permitRequired && activity.permitDetails && (
                <div className="bg-amber-50 p-3 rounded-md">
                  <h6 className="text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    Permit Details
                  </h6>
                  <p className="text-sm text-gray-700">{activity.permitDetails}</p>
                </div>
              )}
              
              {activity.outfitters && activity.outfitters.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium">Recommended Outfitters</h6>
                  <ul className="mt-1 list-disc list-inside">
                    {activity.outfitters.map((outfitter, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{outfitter}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activity.equipmentNeeded && activity.equipmentNeeded.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium">Equipment Needed</h6>
                  <ul className="mt-1 list-disc list-inside">
                    {activity.equipmentNeeded.map((equipment, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{equipment}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activity.weather && (
                <div>
                  <h6 className="text-sm font-medium">Weather Considerations</h6>
                  <p className="text-sm text-gray-700">{activity.weather}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Show more/less button */}
          {(activity.location || activity.distance || activity.elevation || 
            activity.permitDetails || activity.outfitters || activity.equipmentNeeded || 
            activity.weather || activity.routeType) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)} 
              className="mt-2 text-purple-600 hover:text-purple-800 p-0 h-auto text-sm"
            >
              {expanded ? 'Show less' : 'Show more details'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Add connecting line for timeline */}
      {!isLast && (
        <div className="absolute left-[1.45rem] top-[3rem] bottom-[-1rem] w-0.5 bg-gray-200"></div>
      )}
    </Card>
  );
};

export default ActivityCard;
