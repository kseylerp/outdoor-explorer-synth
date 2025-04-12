
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
      bubbleRef.current.style.opacity = '1';
      bubbleRef.current.classList.add('bubble-animate');
    }
  }, []);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        ref={bubbleRef}
        className={`triage-bubble max-w-[80%] py-3 px-4 rounded-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground dark:bg-zinc-800'
        } opacity-0 transition-opacity duration-300 ease-in-out`}
        style={{ wordBreak: 'break-word' }}
      >
        {message}
      </div>
    </div>
  );
};

export default TriageResponseBubble;
