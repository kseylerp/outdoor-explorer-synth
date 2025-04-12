
import React from 'react';

interface TriageResponseBubbleProps {
  message: string;
  isUser?: boolean;
}

const TriageResponseBubble: React.FC<TriageResponseBubbleProps> = ({ 
  message, 
  isUser = false 
}) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser 
            ? 'bg-[#65558F] text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default TriageResponseBubble;
