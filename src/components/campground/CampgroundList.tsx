
import React from 'react';
import { MapPin, Star, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campground } from '@/services/campground/campgroundService';

interface CampgroundListProps {
  campgrounds: Campground[];
  onSelect?: (campground: Campground) => void;
}

const CampgroundList: React.FC<CampgroundListProps> = ({ 
  campgrounds,
  onSelect
}) => {
  // Function to format price range
  const formatPriceRange = (priceObj?: {min: number, max: number, currency: string}) => {
    if (!priceObj) return 'Price not available';
    
    const { min, max, currency } = priceObj;
    const currencySymbol = currency === 'USD' ? '$' : currency;
    
    if (min === max) {
      return `${currencySymbol}${min}`;
    }
    
    return `${currencySymbol}${min} - ${currencySymbol}${max}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Found {campgrounds.length} campgrounds</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {campgrounds.map((campground) => (
          <Card key={campground.id} className="overflow-hidden hover:shadow-md transition-shadow">
            {campground.images && campground.images.length > 0 && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={campground.images[0]} 
                  alt={campground.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardContent className="p-4">
              <h4 className="text-lg font-medium mb-1">{campground.name}</h4>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {campground.location.city || ''} 
                  {campground.location.state ? `, ${campground.location.state}` : ''}
                </span>
              </div>
              
              {campground.rating && (
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span className="text-sm font-medium">{campground.rating}</span>
                  {campground.reviewCount && (
                    <span className="text-sm text-gray-500 ml-1">({campground.reviewCount} reviews)</span>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {campground.description || 'No description available'}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {campground.amenities?.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {campground.amenities && campground.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{campground.amenities.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center text-sm font-medium">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatPriceRange(campground.price)}
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => onSelect && onSelect(campground)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampgroundList;
