
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label = 'Back to Adventures' 
}) => {
  return (
    <Button 
      variant="ghost" 
      className="mb-6 flex items-center gap-2"
      onClick={onClick}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default BackButton;
