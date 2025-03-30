
import React from 'react';
import { Button } from '@/components/ui/button';

interface NotFoundProps {
  message?: string;
  onReturn: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ 
  message = "The trip you're looking for doesn't exist or has been removed.",
  onReturn 
}) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Button onClick={onReturn}>
        Return to Adventures
      </Button>
    </div>
  );
};

export default NotFound;
