
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioVisualizer, setShowAudioVisualizer] = useState(false);
  
  const startRecording = () => {
    setIsRecording(true);
    setShowAudioVisualizer(true);
    
    toast({
      title: "Microphone active",
      description: "Speak now. The assistant will respond when you pause.",
    });
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setShowAudioVisualizer(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Audio enabled" : "Audio muted",
      description: isMuted ? "You can now hear the assistant" : "The assistant's voice is now muted",
    });
  };
  
  return {
    isRecording,
    isMuted,
    showAudioVisualizer,
    startRecording,
    stopRecording,
    toggleMute
  };
};
