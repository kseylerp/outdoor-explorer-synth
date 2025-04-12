
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ActivitySubmitSectionProps {
  isReadyToSubmit: boolean;
  meetStandards: boolean;
  setMeetStandards: (value: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ActivitySubmitSection: React.FC<ActivitySubmitSectionProps> = ({
  isReadyToSubmit,
  meetStandards,
  setMeetStandards,
  onSubmit,
  isSubmitting
}) => {
  if (!isReadyToSubmit) return null;

  return (
    <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox 
          id="standards" 
          checked={meetStandards}
          onCheckedChange={(checked) => setMeetStandards(checked as boolean)}
        />
        <Label htmlFor="standards" className="text-sm">
          This activity meets our standards for reducing over-tourism and ecosystem degradation
        </Label>
      </div>
      <Button 
        onClick={onSubmit} 
        className="w-full"
        disabled={!meetStandards || isSubmitting}
      >
        Submit Activity
      </Button>
    </div>
  );
};

export default ActivitySubmitSection;
