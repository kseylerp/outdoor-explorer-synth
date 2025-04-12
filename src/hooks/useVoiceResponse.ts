
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useVoiceResponse() {
  const [showAudioExperience, setShowAudioExperience] = useState(false);
  const { toast } = useToast();
  
  const isResponseToQuestion = (text: string): boolean => {
    // Common response patterns
    const responsePatterns = [
      /^yes/i,
      /^no/i,
      /^definitely/i,
      /^I'd like/i,
      /^I am/i,
      /^I prefer/i,
      /^Sounds good/i,
      /^That works/i,
      /^I'll/i,
      /^We'll/i
    ];
    
    return responsePatterns.some(pattern => pattern.test(text.trim()));
  };

  const startVoiceExperience = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('Requesting microphone permissions...');
      // Check if we have microphone permissions before showing the UI
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(() => {
        console.log('Microphone permissions granted, starting voice experience');
        setShowAudioExperience(true);
      }).catch(err => {
        console.error('Error accessing microphone:', err);
        toast({
          title: 'Microphone access denied',
          description: 'Please allow microphone access to use voice features.',
          variant: 'destructive'
        });
      });
    } else {
      console.error('MediaDevices API not supported');
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input.',
        variant: 'destructive'
      });
    }
  };

  return {
    showAudioExperience,
    setShowAudioExperience,
    isResponseToQuestion,
    startVoiceExperience
  };
}
