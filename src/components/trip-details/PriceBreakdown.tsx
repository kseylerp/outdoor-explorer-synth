
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface PriceBreakdownProps {
  totalPrice?: number;
  compact?: boolean;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ totalPrice, compact = false }) => {
  // Format price as a string with dollar sign
  const formatPrice = (price?: number): string => {
    if (price === undefined || price <= 0) return 'Price not available';
    return `$${price.toLocaleString()}`;
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
            <p>• Guide Services: $1,800</p>
            <p>• Permits & Park Fees: $150</p>
            <p>• Equipment Rental: $400</p>
            <p>• Meals & Provisions: $350</p>
            <p>• Transportation: $300</p>
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
