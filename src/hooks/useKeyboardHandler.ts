
import { KeyboardEvent } from 'react';

export const useKeyboardHandler = (sendMessage: () => void) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return { handleKeyDown };
};
