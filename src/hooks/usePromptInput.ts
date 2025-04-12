
/**
 * Custom hook to manage prompt input state and visual effects
 * 
 * This hook handles:
 * - Prompt text state management
 * - Lens flash animation effect when user types
 * - References to DOM elements for the textarea and container
 */
import { useState, useEffect, useRef } from 'react';

export function usePromptInput(defaultValue: string = '') {
  const [prompt, setPrompt] = useState(defaultValue);
  const [lensFlashActive, setLensFlashActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptBoxRef = useRef<HTMLDivElement>(null);

  // Trigger lens flash effect when user types
  useEffect(() => {
    if (prompt) {
      setLensFlashActive(true);
      const timer = setTimeout(() => setLensFlashActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [prompt]);

  return {
    prompt,
    setPrompt,
    lensFlashActive,
    textareaRef,
    promptBoxRef
  };
}
