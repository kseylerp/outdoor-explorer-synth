
import React from 'react';
import { MapPin, Calendar, DollarSign, Star, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Campground } from '@/services/campground/campgroundService';

interface CampgroundDetailsProps {
  campground: Campground;
  onBack: () => void;
  onBook?: (campground: Campground) => void;
}

const CampgroundDetails: React.FC<CampgroundDetailsProps> = ({
  campground,
  onBack,
  onBook
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-2 p-0 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{campground.name}</h2>
        </div>
        
        {campground.images && campground.images.length > 0 && (
          <div className="overflow-hidden rounded-md mb-6">
            <img 
              src={campground.images[0]} 
              alt={campground.name}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-purple-700 mr-2" />
            <span>
              {campground.location.city || ''} 
              {campground.location.state ? `, ${campground.location.state}` : ''}
            </span>
          </div>
          
          {campground.rating && (
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2 fill-yellow-500" />
              <span className="font-medium">{campground.rating}</span>
              {campground.reviewCount && (
                <span className="text-gray-500 ml-1">({campground.reviewCount} reviews)</span>
              )}
            </div>
          )}
          
          {campground.price && (
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium">
                {campground.price.min === campground.price.max 
                  ? `$${campground.price.min}` 
                  : `$${campground.price.min} - $${campground.price.max}`
                }
              </span>
            </div>
          )}
          
          {campground.availableSites !== undefined && (
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span>{campground.availableSites} sites available</span>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700">
            {campground.description || 'No description available for this campground.'}
          </p>
        </div>
        
        {campground.amenities && campground.amenities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {campground.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="flex justify-between items-center">
          <div>
            {campground.location.address && (
              <div className="text-sm text-gray-500">
                {campground.location.address}
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => onBook && onBook(campground)}
            className="px-8"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampgroundDetails;
