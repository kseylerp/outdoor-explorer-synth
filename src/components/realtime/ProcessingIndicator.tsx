
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="text-sm text-muted-foreground">The assistant is thinking...</p>
    </div>
  );
};

export default ProcessingIndicator;
