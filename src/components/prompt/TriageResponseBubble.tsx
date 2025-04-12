
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
      bubbleRef.current.classList.add('bubble-animate');
    }
  }, []);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        ref={bubbleRef}
        className={`max-w-[80%] py-3 px-4 rounded-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
        } opacity-0 bubble-animate`}
        style={{ wordBreak: 'break-word' }}
      >
        {message.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < message.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TriageResponseBubble;
