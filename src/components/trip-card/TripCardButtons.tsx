
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
  compactMode?: boolean;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({
  tripId,
  isSaved = false,
  onSave,
  showRemoveButton = false,
  onRemove,
  fullWidth = false,
  compactMode = false
}) => {
  return (
    <div className={`flex justify-between items-center ${!fullWidth && !compactMode ? 'px-6 py-4 bg-white dark:bg-[#202030] shadow-sm' : ''}`}>
      <div className="flex gap-2">
        {onSave && (
          <Button
            onClick={onSave}
            variant={isSaved ? "outline" : "default"}
            className={`flex items-center gap-1 ${fullWidth ? 'w-full' : ''} ${compactMode ? 'py-1.5 h-auto text-sm font-medium shadow-md' : ''} ${isSaved ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600' : 'bg-yugen-purple hover:bg-yugen-purple/90 dark:bg-yugen-bright dark:hover:bg-yugen-bright/90'}`}
            size={compactMode ? "sm" : "default"}
          >
            <BookmarkPlus className={`${compactMode ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
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
