
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trip } from '@/types/trips';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TripRawDataProps {
  trip: Trip;
}

const TripRawData: React.FC<TripRawDataProps> = ({ trip }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full mb-6 border-amber-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-amber-50 hover:bg-amber-100 transition-colors">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-amber-700" />
            <h3 className="text-lg font-semibold text-amber-800">Complete Trip Data</h3>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-amber-700" />
          ) : (
            <ChevronDown className="h-5 w-5 text-amber-700" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-4 bg-amber-50/50">
            <div className="overflow-x-auto">
              <pre className="text-xs bg-white p-4 rounded border border-amber-200 max-h-96 overflow-y-auto">
                {JSON.stringify(trip, null, 2)}
              </pre>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TripRawData;
