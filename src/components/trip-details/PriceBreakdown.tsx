
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

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

  // Generate dynamic price breakdown from available data
  const generatePriceBreakdown = () => {
    if (priceDetails && Object.keys(priceDetails).length > 0) {
      return Object.entries(priceDetails).map(([key, value], index) => (
        <p key={index} className="text-sm text-gray-700">• {key}: {formatPrice(value)}</p>
      ));
    }

    // Default breakdown if specific details aren't provided
    return (
      <>
        <p className="text-sm text-gray-700">• Guide Services: ~$1,800</p>
        <p className="text-sm text-gray-700">• Permits & Park Fees: ~$150</p>
        <p className="text-sm text-gray-700">• Equipment Rental: ~$400</p>
        <p className="text-sm text-gray-700">• Meals & Provisions: ~$350</p>
        <p className="text-sm text-gray-700">• Transportation: ~$300</p>
      </>
    );
  };

  return (
    <Card className="border border-purple-100">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Price Breakdown</h3>
        </div>
        <p className="text-2xl font-semibold mb-2">{formatPrice(totalPrice)}</p>
        
        {!compact ? (
          <div className="text-sm text-gray-700 space-y-1">
            {generatePriceBreakdown()}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Estimated total per person</p>
        )}
        
        {!compact && (
          <p className="text-sm text-gray-500 mt-2">Estimated total per person</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
