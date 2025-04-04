
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Trash2 } from 'lucide-react';

interface TripCardButtonsProps {
  tripId: string;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({
  tripId,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <div className="flex gap-2">
        {onSave && (
          <Button
            onClick={onSave}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BookmarkPlus className="h-4 w-4" />
            {isSaved ? 'Saved' : 'Save Trip'}
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
      </div>
    </div>
  );
};

export default TripCardButtons;
