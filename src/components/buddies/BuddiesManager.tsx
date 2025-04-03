
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import BuddyList from './BuddyList';
import InviteForm from './InviteForm';
import { TripBuddy, fetchTripBuddies } from '@/services/trip/buddyService';

interface BuddiesManagerProps {
  tripId: string;
}

const BuddiesManager: React.FC<BuddiesManagerProps> = ({ tripId }) => {
  const [buddies, setBuddies] = useState<TripBuddy[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const loadBuddies = async () => {
    setLoading(true);
    const data = await fetchTripBuddies(tripId);
    setBuddies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBuddies();
  }, [tripId]);

  const handleInviteSent = () => {
    loadBuddies();
    setInviteDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Trip Buddies
        </h2>
        
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Buddies
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <InviteForm 
              tripId={tripId} 
              onInvitesSent={handleInviteSent} 
              onCancel={() => setInviteDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading trip buddies...</p>
        </div>
      ) : (
        <BuddyList buddies={buddies} onBuddyUpdated={loadBuddies} />
      )}
    </div>
  );
};

export default BuddiesManager;
