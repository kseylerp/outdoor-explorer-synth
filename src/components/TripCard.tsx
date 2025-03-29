
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, MapPin, Clock, DollarSign } from 'lucide-react';
import MapDisplay from './MapDisplay';
import { Trip } from '@/types/trips';

interface TripCardProps {
  trip: Trip;
  expanded?: boolean;
  onExpand?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip,
  expanded = false,
  onExpand
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpand && newExpandedState) {
      onExpand();
    }
  };

  // Generate difficulty badge color
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'challenging': 
      case 'difficult': return 'bg-orange-500';
      case 'expert': 
      case 'extreme': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{trip.title}</CardTitle>
            <CardDescription className="mt-1">{trip.description}</CardDescription>
          </div>
          <Badge className={`${getDifficultyColor(trip.difficultyLevel)} text-white`}>
            {trip.difficultyLevel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-3 flex flex-col sm:flex-row gap-4">
          <div className="h-[200px] w-full sm:w-1/2">
            <MapDisplay 
              center={trip.mapCenter}
              markers={trip.markers}
              journey={trip.journey}
              interactive={false}
            />
          </div>
          
          <div className="flex flex-col justify-between w-full sm:w-1/2">
            <div>
              <h3 className="font-semibold text-md mb-1">Why We Chose This:</h3>
              <p className="text-sm text-gray-600 mb-4">{trip.whyWeChoseThis}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  {trip.duration}
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                  {trip.priceEstimate}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {trip.location}
                </div>
              </div>
            </div>
            
            {trip.suggestedGuides && trip.suggestedGuides.length > 0 && (
              <div>
                <h3 className="font-semibold text-md mb-1">Suggested Guides:</h3>
                <div className="flex flex-wrap gap-1">
                  {trip.suggestedGuides.map((guide, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {guide}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {isExpanded && (
        <div className="px-6 py-2">
          <h3 className="font-semibold text-lg mb-2">Itinerary</h3>
          {trip.itinerary.map((day, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="font-semibold text-md mb-1">Day {day.day}: {day.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{day.description}</p>
              
              {day.activities.map((activity, actIdx) => (
                <div key={actIdx} className="mb-2 ml-2 p-2 border-l-2 border-gray-200">
                  <div className="flex justify-between">
                    <h5 className="font-semibold text-sm">{activity.name}</h5>
                    <span className="text-xs text-gray-500">{activity.duration}</span>
                  </div>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  
                  <div className="mt-1 flex flex-wrap gap-1 text-xs">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    {activity.permitRequired && (
                      <Badge variant="outline" className="bg-amber-100 text-xs">
                        Permit Required
                      </Badge>
                    )}
                  </div>
                  
                  {activity.outfitters && activity.outfitters.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs font-medium">Suggested Outfitters: </span>
                      <span className="text-xs text-gray-600">
                        {activity.outfitters.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      <CardFooter className="pt-2 justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpand}
          className="w-full flex items-center justify-center"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>Show Itinerary <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
