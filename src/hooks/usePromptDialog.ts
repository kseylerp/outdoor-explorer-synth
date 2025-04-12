
/**
 * Custom hook to manage interactive dialog functionality for prompt follow-ups
 * 
 * This hook handles:
 * - Dialog visibility state
 * - Current question being presented to the user
 * - Quick response options for the user to select from
 * - Question detection logic to determine when to show follow-up dialogs
 */
import { useState } from 'react';
import { QuickResponseOption } from '@/components/prompt/types';

export function usePromptDialog() {
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [quickResponseOptions, setQuickResponseOptions] = useState<QuickResponseOption[]>([]);

  /**
   * Analyzes text for potential questions that might need follow-up
   * Currently implements basic detection for question marks
   * @param text - The prompt text to analyze
   */
  const checkForQuestions = (text: string) => {
    // Very basic question detection for demo
    if (text.includes('?')) {
      setTimeout(() => {
        setCurrentQuestion("Would you like to add more details to your request?");
        setQuickResponseOptions([
          { text: "Yes", value: "Yes, I'd like to provide more details." },
          { text: "No", value: "No, that's all I need to know." }
        ]);
        setShowResponseDialog(true);
      }, 1000);
    }
  };

  return {
    showResponseDialog,
    currentQuestion,
    quickResponseOptions,
    setShowResponseDialog,
    setCurrentQuestion,
    setQuickResponseOptions,
    checkForQuestions
  };
}
