
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
