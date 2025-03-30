
import React from 'react';
import { Card } from '@/components/ui/card';
import { CornerDownLeft, MapPin } from 'lucide-react';

const MapFeatures: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CornerDownLeft className="text-purple-600" />
          <h2 className="text-xl font-semibold">Navigation Features</h2>
        </div>
        
        <ul className="grid md:grid-cols-2 gap-4">
          <li className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Turn-by-Turn Directions</h3>
              <p className="text-sm text-gray-600">Detailed navigation with voice guidance</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Offline Maps</h3>
              <p className="text-sm text-gray-600">Download routes for offline use</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Trail Information</h3>
              <p className="text-sm text-gray-600">Elevation profiles and difficulty ratings</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Mobile Optimized</h3>
              <p className="text-sm text-gray-600">Native device integration for better performance</p>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default MapFeatures;
