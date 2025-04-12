
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 py-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Processing your request<span className="animate-pulse">...</span>
      </p>
    </div>
  );
};

export default ProcessingIndicator;
