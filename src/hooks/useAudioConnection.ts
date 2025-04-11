
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { RealtimeAudioService } from '@/services/audio/RealtimeAudioService';

export const useAudioConnection = () => {
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const realtimeServiceRef = useRef<RealtimeAudioService | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeServiceRef.current) {
        realtimeServiceRef.current.disconnect();
        realtimeServiceRef.current = null;
      }
    };
  }, []);

  const startSession = useCallback(async () => {
    try {
      setConnectionState('connecting');
      setErrorMessage(null);
      
      // Create new service instance if needed
      if (!realtimeServiceRef.current) {
        const service = new RealtimeAudioService();
        realtimeServiceRef.current = service;
        
        // Set up event handlers
        service.onTranscriptReceived = (text) => {
          setTranscript(text);
        };
        
        service.onError = (error) => {
          console.error('Realtime service error:', error);
          setErrorMessage(error.message);
          setConnectionState('error');
          toast({
            title: "Connection error",
            description: error.message,
            variant: "destructive"
          });
        };
      }
      
      await realtimeServiceRef.current.initSession();
      
      toast({
        title: "Adventure assistant ready",
        description: "Your AI adventure guide is ready to help you plan your next trip",
      });
      
      setConnectionState('connected');
      return true;
    } catch (error) {
      console.error('Failed to start session:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      setConnectionState('error');
      toast({
        title: "Connection error",
        description: errorMsg,
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const disconnectSession = useCallback(() => {
    if (realtimeServiceRef.current) {
      realtimeServiceRef.current.disconnect();
      realtimeServiceRef.current = null;
      setConnectionState('idle');
      return true;
    }
    return false;
  }, []);

  return {
    connectionState,
    errorMessage,
    transcript,
    realtimeService: realtimeServiceRef.current,
    startSession,
    disconnectSession,
    setTranscript
  };
};
