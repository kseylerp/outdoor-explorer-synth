
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Clean up recorder on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    chunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
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
      setIsLoading(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Simulate speech-to-text for now
      // In a real implementation, you would send this to ElevenLabs or another service
      
      // For demo, we'll just pretend we got a result after a short delay
      setTimeout(() => {
        const demoTranscript = "I want to plan a weekend hiking trip near Lake Tahoe with moderate difficulty trails and mountain views.";
        onTranscript(demoTranscript);
        setIsLoading(false);
      }, 2000);
      
      // Actual implementation would look something like:
      /*
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch('your-speech-to-text-endpoint', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      onTranscript(data.transcript);
      setIsLoading(false);
      */
    } catch (error) {
      console.error('Error processing audio:', error);
      toast("Processing Error", {
        description: 'Could not process your audio. Please try again.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button 
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading || isProcessing}
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        className="rounded-full w-16 h-16 flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      <div className="text-sm text-gray-500">
        {isRecording ? 'Tap to stop recording' : 
         isLoading ? 'Processing...' : 
         isProcessing ? 'Planning your adventure...' : 
         'Tap to start recording'}
      </div>
    </div>
  );
};

export default VoiceInput;
