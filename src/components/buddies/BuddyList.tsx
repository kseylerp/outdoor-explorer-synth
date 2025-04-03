
import React from 'react';
import { TripBuddy } from '@/services/trip/buddyService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Trash2, Edit, UserCheck, UserX } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { updateBuddyNotes, updateBuddyStatus, removeBuddy } from '@/services/trip/buddyService';

interface BuddyListProps {
  buddies: TripBuddy[];
  onBuddyUpdated: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'declined':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }
};

const BuddyList: React.FC<BuddyListProps> = ({ buddies, onBuddyUpdated }) => {
  const [selectedBuddy, setSelectedBuddy] = React.useState<TripBuddy | null>(null);
  const [notes, setNotes] = React.useState('');
  
  const handleSaveNotes = async () => {
    if (!selectedBuddy) return;
    
    const success = await updateBuddyNotes(selectedBuddy.id, notes);
    if (success) {
      toast({
        title: 'Notes updated',
        description: 'Buddy notes have been saved',
      });
      onBuddyUpdated();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateStatus = async (buddyId: string, status: 'confirmed' | 'declined' | 'pending') => {
    const success = await updateBuddyStatus(buddyId, status);
    if (success) {
      toast({
        title: 'Status updated',
        description: `Buddy status updated to ${status}`,
      });
      onBuddyUpdated();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };
  
  const handleRemoveBuddy = async (buddyId: string) => {
    if (confirm('Are you sure you want to remove this buddy from the trip?')) {
      const success = await removeBuddy(buddyId);
      if (success) {
        onBuddyUpdated();
      }
    }
  };
  
  if (buddies.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
        <p className="text-gray-500">No buddies added to this trip yet.</p>
        <p className="text-sm text-gray-400 mt-1">Use the invite button to add trip companions.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {buddies.map((buddy) => (
        <Card key={buddy.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{buddy.name}</h3>
                
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className={getStatusColor(buddy.status)}>
                    {buddy.status.charAt(0).toUpperCase() + buddy.status.slice(1)}
                  </Badge>
                  
                  {buddy.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{buddy.email}</span>
                    </div>
                  )}
                  
                  {buddy.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{buddy.phone}</span>
                    </div>
                  )}
                </div>
                
                {buddy.notes && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-md">
                    {buddy.notes}
                  </p>
                )}
              </div>
              
              <div className="flex gap-1">
                {buddy.status !== 'confirmed' && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleUpdateStatus(buddy.id, 'confirmed')}
                  >
                    <UserCheck className="h-4 w-4" />
                  </Button>
                )}
                
                {buddy.status !== 'declined' && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleUpdateStatus(buddy.id, 'declined')}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedBuddy(buddy);
                        setNotes(buddy.notes || '');
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notes for {selectedBuddy?.name}</DialogTitle>
                    </DialogHeader>
                    
                    <Textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this trip buddy..."
                      className="min-h-[100px]"
                    />
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      
                      <DialogClose asChild>
                        <Button onClick={handleSaveNotes}>Save Notes</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveBuddy(buddy.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuddyList;
