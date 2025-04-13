
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceRecordingButtonProps {
  onTranscriptReceived: (transcript: string) => void;
  disabled: boolean;
}

const VoiceRecordingButton: React.FC<VoiceRecordingButtonProps> = ({ 
  onTranscriptReceived,
  disabled
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessingVoice(true);
        
        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64 for sending to API
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            // In a real implementation, we would send this to the ElevenLabs API
            // For now, let's simulate a response with a timeout
            
            // Simulated response for demo purposes
            setTimeout(() => {
              const simulatedText = "I would like to do a weekend trip hiking Yosemite on trails with fewer people.";
              onTranscriptReceived(simulatedText);
              setIsProcessingVoice(false);
            }, 1500);
          };
        } catch (error) {
          console.error('Error processing voice:', error);
          toast("Voice Processing Error", {
            description: "We couldn't process your voice. Please try again or type your request.",
            variant: 'destructive',
          });
          setIsProcessingVoice(false);
        }
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast("Recording started", {
        description: 'Speak now. Click the microphone again to stop recording.',
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast("Microphone Error", {
        description: 'Could not access your microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      onClick={toggleRecording}
      disabled={disabled || isProcessingVoice}
      size="icon"
      variant={isRecording ? "destructive" : "default"}
      className="rounded-full bg-[#9870FF] hover:bg-[#7E69AB]"
    >
      {isProcessingVoice ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
          <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      )}
    </Button>
  );
};

export default VoiceRecordingButton;
