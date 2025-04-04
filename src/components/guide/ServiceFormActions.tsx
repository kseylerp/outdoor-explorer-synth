
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const ServiceFormActions: React.FC<ServiceFormActionsProps> = ({
  isEditing,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-2">
      {isEditing && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button type="submit">
        {isEditing ? 'Update Service' : 'Add Service'}
      </Button>
    </div>
  );
};

export default ServiceFormActions;
