
/**
 * Custom hook to manage voice input functionality
 * 
 * This hook handles:
 * - Voice experience visibility state
 * - Processing voice transcripts
 * - Integration with the voice response system
 * - Handling trip data received via voice
 */
import { useState, useCallback } from 'react';
import { useVoiceResponse } from '@/hooks/useVoiceResponse';

export function usePromptVoice(
  onTranscript?: (transcript: string, tripData?: any) => void
) {
  const [showAudioExperience, setShowAudioExperience] = useState(false);
  
  const {
    isResponseToQuestion,
    startVoiceExperience
  } = useVoiceResponse();

  /**
   * Processes voice transcripts and determines how to handle them
   * @param transcript - The transcribed text from voice input
   * @param tripData - Optional trip data that might be extracted from voice processing
   */
  const handleVoiceTranscript = useCallback((transcript: string, tripData?: any) => {
    console.log(`Handling voice transcript: "${transcript}"`);
    
    if (!transcript.trim()) {
      console.warn('Empty transcript received');
      return;
    }
    
    // If this is a response to a question, handle differently
    if (isResponseToQuestion(transcript)) {
      // This could be handled with a dialog if needed
    } else {
      // If this is an initial prompt, submit it directly
      if (onTranscript) {
        onTranscript(transcript, tripData);
      }
    }
  }, [isResponseToQuestion, onTranscript]);

  return {
    showAudioExperience,
    setShowAudioExperience,
    handleVoiceTranscript,
    startVoiceExperience
  };
}
