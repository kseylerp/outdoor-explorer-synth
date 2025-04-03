
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Trash2, UserPlus } from 'lucide-react';
import { BuddyInvite, addBuddy } from '@/services/trip/buddyService';
import { toast } from '@/hooks/use-toast';

interface InviteFormProps {
  tripId: string;
  onInvitesSent: () => void;
  onCancel: () => void;
}

const InviteForm: React.FC<InviteFormProps> = ({ tripId, onInvitesSent, onCancel }) => {
  const [invites, setInvites] = useState<BuddyInvite[]>([
    { name: '', email: '', phone: '', notes: '' }
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleAddInvite = () => {
    setInvites([...invites, { name: '', email: '', phone: '', notes: '' }]);
  };

  const handleRemoveInvite = (index: number) => {
    if (invites.length === 1) {
      // Don't remove the last invite, just clear it
      setInvites([{ name: '', email: '', phone: '', notes: '' }]);
      return;
    }
    const newInvites = [...invites];
    newInvites.splice(index, 1);
    setInvites(newInvites);
  };

  const handleInviteChange = (index: number, field: keyof BuddyInvite, value: string) => {
    const newInvites = [...invites];
    newInvites[index] = { ...newInvites[index], [field]: value };
    setInvites(newInvites);
  };

  const validateInvites = () => {
    let isValid = true;
    const errors: string[] = [];

    invites.forEach((invite, index) => {
      if (!invite.name.trim()) {
        errors.push(`Invite #${index + 1}: Name is required`);
        isValid = false;
      }

      // Either email or phone should be provided
      if (!invite.email?.trim() && !invite.phone?.trim()) {
        errors.push(`Invite #${index + 1}: Either email or phone is required`);
        isValid = false;
      }
    });

    if (!isValid) {
      toast({
        title: 'Invalid invites',
        description: errors.join('\n'),
        variant: 'destructive'
      });
    }

    return isValid;
  };

  const handleSendInvites = async () => {
    if (!validateInvites()) return;

    setIsSending(true);
    
    // Filter out empty invites
    const validInvites = invites.filter(invite => 
      invite.name.trim() && (invite.email?.trim() || invite.phone?.trim())
    );
    
    try {
      // Add each buddy to the database
      await Promise.all(
        validInvites.map(invite => addBuddy(tripId, invite))
      );
      
      toast({
        title: 'Invites sent',
        description: `${validInvites.length} ${validInvites.length === 1 ? 'buddy' : 'buddies'} invited to the trip`,
      });
      
      onInvitesSent();
    } catch (error) {
      console.error('Error sending invites:', error);
      toast({
        title: 'Error',
        description: 'Failed to send some invites',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Invite Buddies</h3>
        <p className="text-sm text-gray-500">
          Invite your friends to join this trip. Provide their name and either an email or phone number.
        </p>
      </div>

      {invites.map((invite, index) => (
        <div key={index} className="p-4 border rounded-md bg-slate-50 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Buddy #{index + 1}</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRemoveInvite(index)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={invite.name}
                onChange={(e) => handleInviteChange(index, 'name', e.target.value)}
                placeholder="Full name"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <Input
                  value={invite.email}
                  onChange={(e) => handleInviteChange(index, 'email', e.target.value)}
                  placeholder="Email address"
                  type="email"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Phone
                </label>
                <Input
                  value={invite.phone}
                  onChange={(e) => handleInviteChange(index, 'phone', e.target.value)}
                  placeholder="Phone number"
                  type="tel"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea
                value={invite.notes}
                onChange={(e) => handleInviteChange(index, 'notes', e.target.value)}
                placeholder="Any notes about this person..."
                className="resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}

      <Button 
        onClick={handleAddInvite} 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Add Another Buddy
      </Button>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSending}>
          Cancel
        </Button>
        <Button 
          onClick={handleSendInvites} 
          disabled={isSending}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSending ? 'Sending...' : 'Send Invites'}
        </Button>
      </div>
    </div>
  );
};

export default InviteForm;
