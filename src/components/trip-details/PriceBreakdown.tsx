
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PriceBreakdownProps {
  totalPrice?: number;
  compact?: boolean;
  priceDetails?: Record<string, number | string>;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ totalPrice, compact = false, priceDetails }) => {
  // Format price as a string with dollar sign
  const formatPrice = (price?: number | string): string => {
    if (price === undefined) return 'Price not available';
    if (typeof price === 'string') {
      // If price is already formatted as a string, return it
      return price.startsWith('$') ? price : `$${price}`;
    }
    if (price <= 0) return 'Price not available';
    return `$${price.toLocaleString()}`;
  };

  // Log price data to verify we're not hardcoding or truncating
  console.log('PriceBreakdown - totalPrice:', totalPrice);
  console.log('PriceBreakdown - priceDetails:', priceDetails);

  const priceDetailsToDisplay = priceDetails || {};

  return (
    <Card className="border border-purple-100">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-purple-600 flex-shrink-0" />
          <h3 className="text-lg font-semibold break-words">Price Breakdown</h3>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1">
                  <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Estimated total price per person. Actual costs may vary based on group size, season, and specific trip customizations.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <p className="text-2xl font-semibold mb-2">{formatPrice(totalPrice)}</p>
        
        {!compact && Object.keys(priceDetailsToDisplay).length > 0 ? (
          <div className="text-sm text-gray-700 space-y-1">
            {Object.entries(priceDetailsToDisplay).map(([key, value], index) => (
              <p key={index} className="text-sm text-gray-700 flex">
                <span className="mr-2 flex-shrink-0">•</span>
                <span className="break-words">{key}: {formatPrice(value)}</span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Estimated total per person</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
