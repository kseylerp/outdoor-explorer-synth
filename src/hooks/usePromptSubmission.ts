
import { useCallback } from 'react';
import { usePromptDialog } from '@/hooks/usePromptDialog';

export function usePromptSubmission(
  prompt: string,
  onSubmit: (prompt: string) => void,
  setPrompt: (prompt: string) => void
) {
  const { checkForQuestions } = usePromptDialog();

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
