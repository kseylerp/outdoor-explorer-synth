
import { useState, useEffect, useCallback } from 'react';
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
    disconnectSession,
    setTranscript
  } = useAudioConnection();
  
  const {
    history,
    message,
    isProcessing,
    pendingTranscript,
    setMessage,
    handleSendMessage,
    setIsProcessing,
    addUserMessage,
    addAssistantMessage,
    processTranscript
  } = useChatMessages();
  
  const {
    isRecording,
    isMuted,
    showAudioVisualizer,
    audioLevel,
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
      processTranscript(transcript);
    }
  }, [transcript, processTranscript]);

  const handleStartRecording = useCallback(() => {
    // Make sure we have an active session before starting recording
    if (connectionState !== 'connected') {
      startSession().then(success => {
        if (success) {
          startRecording();
        }
      });
    } else {
      startRecording();
    }
  }, [connectionState, startSession, startRecording]);

  return {
    state,
    message,
    transcript: pendingTranscript || transcript,
    isRecording,
    isMuted,
    history,
    errorMessage,
    showAudioVisualizer,
    audioLevel,
    setMessage,
    startSession,
    handleSendMessage,
    startRecording: handleStartRecording,
    stopRecording,
    toggleMute,
    handleKeyDown
  };
};
