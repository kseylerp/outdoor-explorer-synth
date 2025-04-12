
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
        className={`triage-bubble ${
          isUser 
            ? 'triage-user' 
            : 'triage-ai'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default TriageResponseBubble;
