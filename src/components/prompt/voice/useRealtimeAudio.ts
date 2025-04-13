
/**
 * Custom hook for managing realtime audio connections and processing
 * 
 * Features:
 * - Initializes audio connection with realtime API
 * - Handles audio session creation and management
 * - Processes transcripts and trip data
 * - Provides error handling for audio connection issues
 */
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface RealtimeAudioOptions {
  onTranscriptReceived?: (transcript: string) => void;
  onTripDataReceived?: (tripData: any, transcript: string) => void;
  onError?: (error: Error) => void;
}

export const useRealtimeAudio = (options: RealtimeAudioOptions) => {
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize the audio connection with the realtime API
   * @param isListening - Whether to actively listen for audio input
   * @returns A promise that resolves to the audio service instance or null
   */
  const initializeAudio = (isListening: boolean) => {
    if (isListening) {
      console.log('Initializing voice experience and connecting to Realtime API');
      
      return import('@/services/audio/RealtimeAudioService').then(({ RealtimeAudioService }) => {
        const service = new RealtimeAudioService();
        
        service.initSession()
          .then((sessionId) => {
            console.log('Realtime session started with ID:', sessionId);
            
            // When we connect, check the voice being used
            toast("Connected with Sage voice", {
              description: "You're now connected using OpenAI's Sage voice assistant",
            });
            
            service.onTranscriptReceived = (transcript) => {
              if (transcript && transcript.trim() && options.onTranscriptReceived) {
                console.log("Received transcript:", transcript);
                options.onTranscriptReceived(transcript);
              }
            };
            
            service.onTripDataReceived = (tripData) => {
              console.log('Trip data received in VoiceExperience:', tripData);
              if (tripData && options.onTripDataReceived) {
                // Pass both transcript and trip data to parent
                service.getTranscript().then(transcript => {
                  if (transcript) {
                    options.onTripDataReceived(tripData, transcript);
                  }
                });
              }
            };
            
            service.onError = (error) => {
              console.error('Realtime audio error:', error);
              setError(error.message);
              
              if (options.onError) {
                options.onError(error);
              }
              
              toast("Error with voice service", {
                description: error.message,
                variant: "destructive"
              });
            };
            
            return service;
          })
          .catch(error => {
            console.error('Failed to initialize realtime session:', error);
            setError(`Connection failed: ${error.message}`);
            
            toast("Connection failed", {
              description: "Could not connect to the voice service. Please try again.",
              variant: "destructive"
            });
            
            if (options.onError) {
              options.onError(error);
            }
            
            throw error;
          });
      }).catch(err => {
        console.error('Error importing RealtimeAudioService:', err);
        setError(`Failed to load audio service: ${err.message}`);
        
        if (options.onError) {
          options.onError(err);
        }
        
        throw err;
      });
    }
    
    return Promise.resolve(null);
  };

  return {
    error,
    setError,
    initializeAudio
  };
};
