
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, UserPlus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import InviteForm from '@/components/buddies/InviteForm';

interface TripCardButtonsProps {
  tripId: string;
  isSaved: boolean;
  onSave: () => void;
  showRemoveButton: boolean;
  onRemove?: () => void;
}

const TripCardButtons: React.FC<TripCardButtonsProps> = ({ 
  tripId,
  isSaved, 
  onSave, 
  showRemoveButton,
  onRemove
}) => {
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  return (
    <div className="flex gap-2">
      {/* Invite Button - Always shown and now more prominent */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 flex-1">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Buddies
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <InviteForm 
            tripId={tripId} 
            onInvitesSent={() => setInviteDialogOpen(false)} 
            onCancel={() => setInviteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Save Button - Only shown if not in "remove" mode */}
      {!showRemoveButton && (
        <Button onClick={onSave} variant="outline" className={`${isSaved ? 'border-green-500 text-green-600' : 'border-gray-300'} flex-1`}>
          <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-green-500' : ''}`} />
          {isSaved ? 'Saved' : 'Save Trip'}
        </Button>
      )}

      {/* Remove Button - Only shown in "remove" mode, with less prominence */}
      {showRemoveButton && (
        <Button 
          onClick={onRemove} 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-50 flex-none ml-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TripCardButtons;
