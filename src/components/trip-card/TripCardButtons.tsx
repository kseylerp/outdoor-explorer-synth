
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, Map, Trash } from 'lucide-react';

interface TripCardButtonsProps {
  tripId: string;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  onExpand?: () => void;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({
  tripId,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove,
  onExpand
}) => {
  return (
    <div className="flex justify-between mt-4">
      <div className="flex space-x-2">
        {onExpand && (
          <Button
            onClick={onExpand}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        )}
        
        <Button
          onClick={onSave}
          variant={isSaved ? "default" : "outline"}
          size="sm"
          className="flex items-center space-x-1"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
          <span>{isSaved ? 'Saved' : 'Save Trip'}</span>
        </Button>
      </div>
      
      {showRemoveButton && onRemove && (
        <Button
          onClick={onRemove}
          variant="destructive"
          size="sm"
          className="flex items-center space-x-1"
        >
          <Trash className="h-4 w-4" />
          <span>Remove</span>
        </Button>
      )}
    </div>
  );
};

export default TripCardButtons;
