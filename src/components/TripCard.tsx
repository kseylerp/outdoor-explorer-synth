
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, MapPin, Clock, DollarSign, Share2, Bookmark } from 'lucide-react';
import MapDisplay from './MapDisplay';
import TripIntensityBar from './TripIntensityBar';
import { Trip } from '@/types/trips';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
  expanded?: boolean;
  onExpand?: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip,
  expanded = false,
  onExpand,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const navigate = useNavigate();
  
  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpand && newExpandedState) {
      onExpand();
    }
  };

  // Calculate intensity level based on difficulty
  const getIntensityLevel = (level: string): number => {
    switch (level.toLowerCase()) {
      case 'easy': return 15;
      case 'moderate': return 40;
      case 'challenging': return 60;
      case 'difficult': return 80;
      case 'expert': 
      case 'extreme': return 95;
      default: return 50;
    }
  };
  
  const handleSaveTrip = () => {
    if (onSave) {
      onSave();
    } else {
      navigate(`/trip/${trip.id}`);
    }
  };
  
  const handleShareTrip = () => {
    // In a real app, this would open a sharing dialog
    navigator.clipboard.writeText(`Check out this amazing trip: ${trip.title}`);
    alert('Trip link copied to clipboard!');
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 border-gray-200 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{trip.title}</CardTitle>
            <CardDescription className="mt-1">{trip.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-3 flex flex-col sm:flex-row gap-4">
          <div className="h-[200px] w-full sm:w-1/2">
            <MapDisplay 
              center={trip.mapCenter}
              markers={trip.markers}
              journey={trip.journey}
              interactive={true}
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
              
              <div className="mb-4">
                <TripIntensityBar level={getIntensityLevel(trip.difficultyLevel)} readOnly />
              </div>
            </div>
            
            <div className="flex gap-2">
              {showRemoveButton ? (
                <Button onClick={onRemove} variant="default" className="bg-red-600 hover:bg-red-700 flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Remove Trip
                </Button>
              ) : (
                <Button onClick={handleSaveTrip} variant="default" className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} flex-1`}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  {isSaved ? 'Saved' : 'Save Trip'}
                </Button>
              )}
              <Button onClick={handleShareTrip} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            {trip.suggestedGuides && trip.suggestedGuides.length > 0 && (
              <div className="mt-4">
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
      
      <CardFooter className="pt-2 justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleExpand}
          className="w-full flex items-center justify-center bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 font-medium"
        >
          {isExpanded ? (
            <>Hide Itinerary <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>Show Itinerary <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
      
      {isExpanded && (
        <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <h3 className="font-semibold text-lg mb-4 text-purple-800">Itinerary</h3>
          {trip.itinerary.map((day, idx) => (
            <div key={idx} className="mb-6">
              <h4 className="font-semibold text-md mb-2 text-purple-700">Day {day.day}: {day.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{day.description}</p>
              
              <div className="space-y-4">
                {day.activities.map((activity, actIdx) => (
                  <div key={actIdx} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-purple-300">
                    <div className="flex justify-between">
                      <h5 className="font-semibold text-sm">{activity.name}</h5>
                      <span className="text-xs text-gray-500">{activity.duration}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-1 text-xs">
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
                      <div className="mt-2">
                        <span className="text-xs font-medium">Suggested Outfitters: </span>
                        <span className="text-xs text-gray-600">
                          {activity.outfitters.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TripCard;
