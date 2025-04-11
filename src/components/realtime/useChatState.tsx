
import { useState, useEffect } from 'react';
import { useAudioConnection } from '@/hooks/useAudioConnection';
import { useChatMessages, ChatMessage } from '@/hooks/useChatMessages';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useKeyboardHandler } from '@/hooks/useKeyboardHandler';

export type ChatState = 'idle' | 'connecting' | 'connected' | 'recording' | 'processing' | 'error';

export const useChatState = () => {
  // Use our smaller, focused hooks
  const { 
    connectionState,
    errorMessage,
    transcript,
    realtimeService,
    startSession,
    setTranscript
  } = useAudioConnection();
  
  const {
    history,
    message,
    isProcessing,
    setMessage,
    handleSendMessage,
    setIsProcessing,
    addUserMessage,
    addAssistantMessage
  } = useChatMessages();
  
  const {
    isRecording,
    isMuted,
    showAudioVisualizer,
    startRecording,
    stopRecording,
    toggleMute
  } = useAudioRecording();
  
  const { handleKeyDown } = useKeyboardHandler(handleSendMessage);

  // Compute the overall state based on the various states from our hooks
  const [state, setState] = useState<ChatState>('idle');
  
  useEffect(() => {
    if (connectionState === 'connecting') {
      setState('connecting');
    } else if (isProcessing) {
      setState('processing');
    } else if (isRecording) {
      setState('recording');
    } else if (connectionState === 'connected') {
      setState('connected');
    } else if (connectionState === 'error') {
      setState('error');
    } else {
      setState('idle');
    }
  }, [connectionState, isProcessing, isRecording]);
  
  // Handle transcript changes from the audio service
  useEffect(() => {
    if (transcript && transcript.trim()) {
      addUserMessage(transcript);
      setIsProcessing(true);
      
      // Simulate assistant's response
      setTimeout(() => {
        const responses = [
          "I'd recommend exploring the hidden trails in Yosemite Valley. The Mirror Lake loop is less traveled but offers stunning views.",
          "For a weekend trip to Yosemite, check out the Pohono Trail. It's a moderate difficulty hike with fewer crowds and amazing viewpoints.",
          "Instead of the main Yosemite trails, try the Chilnualna Falls trail in Wawona. It's challenging but rewards you with a series of cascading waterfalls and minimal crowds."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addAssistantMessage(randomResponse);
        setIsProcessing(false);
      }, 2000);
    }
  }, [transcript]);

  return {
    state,
    message,
    transcript,
    isRecording,
    isMuted,
    history,
    errorMessage,
    showAudioVisualizer,
    setMessage,
    startSession,
    handleSendMessage,
    startRecording,
    stopRecording,
    toggleMute,
    handleKeyDown
  };
};
