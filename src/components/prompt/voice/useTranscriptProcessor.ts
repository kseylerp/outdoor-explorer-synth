
/**
 * Custom hook for processing voice transcripts and generating appropriate response options
 * 
 * Features:
 * - Analyzes transcript text for question patterns
 * - Provides contextual quick response options based on transcript content
 * - Handles different types of questions (yes/no, skill level, timing, etc.)
 */
import { useState } from 'react';

type QuickResponse = { text: string; value: string };

export const useTranscriptProcessor = () => {
  const [quickResponses, setQuickResponses] = useState<QuickResponse[]>([]);

  /**
   * Analyzes text to extract appropriate quick response options
   * @param text - The transcript text to analyze
   */
  const extractQuickResponses = (text: string) => {
    // Look for yes/no questions
    if (/would you like|do you want|are you interested|should I|yes or no/i.test(text)) {
      setQuickResponses([
        { text: "Yes", value: "Yes, please do!" },
        { text: "No", value: "No, thanks." }
      ]);
      return;
    }
    
    // Look for skill level questions
    if (/skill level|how experienced|difficulty|challenging/i.test(text)) {
      setQuickResponses([
        { text: "Beginner", value: "I'm a beginner." },
        { text: "Intermediate", value: "I have intermediate experience." },
        { text: "Advanced", value: "I'm an advanced adventurer." }
      ]);
      return;
    }
    
    // Look for time of year questions
    if (/time of year|when.*visit|season|month|spring|summer|fall|winter/i.test(text)) {
      setQuickResponses([
        { text: "Spring", value: "I'm planning to go in the spring." },
        { text: "Summer", value: "I'm planning to go in the summer." },
        { text: "Fall", value: "I'm planning to go in the fall." },
        { text: "Winter", value: "I'm planning to go in the winter." }
      ]);
      return;
    }
    
    // Default: clear any previous responses if no patterns match
    setQuickResponses([]);
  };

  return {
    quickResponses,
    extractQuickResponses
  };
};
