
import { useState } from 'react';
import { QuickResponseOption } from '@/components/prompt/types';

export function usePromptDialog() {
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [quickResponseOptions, setQuickResponseOptions] = useState<QuickResponseOption[]>([]);

  // Check if the prompt might contain questions that need follow-up
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
