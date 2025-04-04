
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TripCardButtonsProps {
  tripId: string;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({
  tripId,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove,
  onExpand,
  isExpanded = false
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          variant="outline"
          className="flex items-center gap-2"
        >
          <BookmarkPlus className="h-4 w-4" />
          {isSaved ? 'Saved' : 'Save Trip'}
        </Button>
        
        {onExpand && (
          <Button
            onClick={onExpand}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Details
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {showRemoveButton && onRemove && (
          <Button
            onClick={onRemove}
            variant="outline"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button asChild>
          <Link to={`/trip/${tripId}`}>View Trip</Link>
        </Button>
      </div>
    </div>
  );
};

export default TripCardButtons;
