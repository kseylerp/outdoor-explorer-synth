
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2 } from 'lucide-react';

interface TripCardButtonsProps {
  isSaved: boolean;
  onSave: () => void;
  onShare: () => void;
  showRemoveButton: boolean;
  onRemove?: () => void;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({ 
  isSaved, 
  onSave, 
  onShare,
  showRemoveButton,
  onRemove
}) => {
  return (
    <div className="flex gap-2">
      {showRemoveButton ? (
        <Button onClick={onRemove} variant="default" className="bg-red-600 hover:bg-red-700 flex-1">
          <Bookmark className="h-4 w-4 mr-2" />
          Remove Trip
        </Button>
      ) : (
        <Button onClick={onSave} variant="default" className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} flex-1`}>
          <Bookmark className="h-4 w-4 mr-2" />
          {isSaved ? 'Saved' : 'Save Trip'}
        </Button>
      )}
      <Button onClick={onShare} variant="outline" className="flex-1">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default TripCardButtons;
