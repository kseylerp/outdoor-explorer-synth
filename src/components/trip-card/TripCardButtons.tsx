
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Trash2 } from 'lucide-react';

interface TripCardButtonsProps {
  tripId: string;
  isSaved?: boolean;
  onSave?: () => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  fullWidth?: boolean;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({
  tripId,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove,
  fullWidth = false
}) => {
  return (
    <div className={`flex justify-between items-center ${!fullWidth ? 'px-6 py-4 bg-white dark:bg-[#202020] shadow-sm' : ''}`}>
      <div className="flex gap-2">
        {onSave && (
          <Button
            onClick={onSave}
            variant={isSaved ? "outline" : "default"}
            className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}
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
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripCardButtons;
