
/**
 * Custom hook to handle prompt submission logic
 * 
 * This hook handles:
 * - Submit functionality for prompts
 * - Keyboard event handling (Enter key submission)
 * - Question detection in submitted prompts
 * - Clearing the prompt input after submission
 */
import { useCallback } from 'react';
import { usePromptDialog } from '@/hooks/usePromptDialog';

export function usePromptSubmission(
  prompt: string,
  onSubmit: (prompt: string) => void,
  setPrompt: (prompt: string) => void
) {
  const { checkForQuestions } = usePromptDialog();

  /**
   * Handles the submission of a prompt
   * Validates the prompt, calls the submission callback, clears the input,
   * and checks for potential follow-up questions
   */
  const handleSubmit = useCallback(() => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt && onSubmit) {
      onSubmit(trimmedPrompt);
      
      // Clear the prompt after submission
      setPrompt('');
      
      // Check for potential follow-up questions in the prompt
      checkForQuestions(trimmedPrompt);
    }
  }, [prompt, onSubmit, setPrompt, checkForQuestions]);

  /**
   * Handles keyboard events, specifically for Enter key submission
   * @param e - Keyboard event
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return {
    handleSubmit,
    handleKeyDown
  };
}
