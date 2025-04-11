
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceFormActions: React.FC<ServiceFormActionsProps> = ({
  isEditing,
  onCancel,
  isSubmitting
}) => {
  return (
    <div className="flex justify-end gap-2">
      {isEditing && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <FormSubmitStatus />
        ) : (
          isEditing ? 'Update Service' : 'Add Service'
        )}
      </Button>
    </div>
  );
};

// Extracted status indicator into its own component
const FormSubmitStatus: React.FC = () => (
  <span className="flex items-center">
    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
    Submitting...
  </span>
);

export default ServiceFormActions;
