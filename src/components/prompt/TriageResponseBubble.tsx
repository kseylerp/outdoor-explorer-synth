
import React, { useEffect, useRef } from 'react';

interface TriageResponseBubbleProps {
  message: string;
  isUser?: boolean;
}

const TriageResponseBubble: React.FC<TriageResponseBubbleProps> = ({ 
  message, 
  isUser = false 
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  // Animation effect when bubble appears
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.classList.add('chat-bubble-in');
    }
  }, []);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        ref={bubbleRef}
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
