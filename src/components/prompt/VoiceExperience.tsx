import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AudioVisualizer from './voice/AudioVisualizer';
import VoiceResponseProcessor from './voice/VoiceResponseProcessor';
import { useTranscriptProcessor } from './voice/useTranscriptProcessor';
import { useRealtimeAudio } from './voice/useRealtimeAudio';

interface VoiceExperienceProps {
  onClose: () => void;
  onTranscript: (text: string, tripData?: any) => void;
}

const VoiceExperience: React.FC<VoiceExperienceProps> = ({ onClose, onTranscript }) => {
  const [isListening, setIsListening] = useState(true);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [voice] = useState<string>("sage"); // Always use sage voice
  const { toast } = useToast();
  
  // Custom hooks
  const { quickResponses, extractQuickResponses } = useTranscriptProcessor();
  const { error, initializeAudio } = useRealtimeAudio({
    onTranscriptReceived: (transcript) => {
      // When we get the transcript, don't close yet, wait for AI response
      setAiResponseText("I'm finding the perfect adventure options based on your request...");
      setIsListening(false);
      setProcessingComplete(false);
      
      // Pass transcript to parent
      onTranscript(transcript);
      
      // Extract potential quick response options from transcript
      extractQuickResponses(transcript);
      
      // Simulate AI response after a delay
      setTimeout(() => {
        setAiResponseText("I understand your adventure request. Let me find some great offbeat options for you!");
        
        // After AI responds verbally, prepare to generate the trip with the transcript
        setTimeout(() => {
          setProcessingComplete(true);
          // User can now close the experience or keep listening to AI
        }, 2000);
      }, 1500);
    },
    onTripDataReceived: (tripData, transcript) => {
      // Pass both transcript and trip data to parent
      onTranscript(transcript, tripData);
    },
    onError: (error) => {
      // Auto-close after error
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  });
  
  // Connect to the OpenAI Realtime API and start listening
  useEffect(() => {
    if (isListening) {
      let audioService: any = null;
      
      initializeAudio(isListening)
        .then(service => {
          audioService = service;
        })
        .catch(() => {
          // Error already handled in useRealtimeAudio
        });
        
      return () => {
        if (audioService) {
          console.log('Disconnecting voice service');
          audioService.disconnect();
        }
      };
    }
  }, [isListening, initializeAudio]);

  // Handle manual close with confirmation if needed
  const handleClose = () => {
    if (!processingComplete && !isListening) {
      // If we received a transcript but processing isn't complete,
      // we should still submit to generate the trip
      onClose();
    } else {
      // Otherwise just close normally
      onClose();
    }
  };

  // Handle quick response button click
  const handleQuickResponse = (responseValue: string) => {
    // Pass the response as transcript
    onTranscript(responseValue);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="text-white text-xl font-medium mb-2">
        {isListening ? 'Speak now...' : aiResponseText || 'Processing...'}
      </div>

      <div className="text-white/70 text-sm mb-6">
        Using OpenAI with Sage voice
      </div>
      
      {error ? (
        <div className="text-red-400 p-4 bg-red-900/20 rounded-md mb-6 max-w-md text-center">
          {error}
          <div className="mt-2">
            <Button onClick={onClose} variant="destructive" size="sm">Close</Button>
          </div>
        </div>
      ) : (
        <>
          <AudioVisualizer isListening={isListening} />
          
          {isListening ? (
            <div className="text-white/70 text-sm max-w-md text-center px-4">
              What adventure are you looking for? Describe your ideal trip!
            </div>
          ) : (
            <VoiceResponseProcessor
              aiResponseText={aiResponseText}
              processingComplete={processingComplete}
              quickResponses={quickResponses}
              onClose={onClose}
              onQuickResponse={handleQuickResponse}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VoiceExperience;
