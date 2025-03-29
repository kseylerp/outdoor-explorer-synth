
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
            const base64Audio = (reader.result as string).split(',')[1];
            
            // In a real implementation, we would send this to the ElevenLabs API
            // For now, let's simulate a response with a timeout
            
            // Simulated response for demo purposes
            setTimeout(() => {
              const simulatedText = "I want to go hiking in Yosemite National Park for three days.";
              setPrompt(simulatedText);
              setIsProcessingVoice(false);
              
              if (textareaRef.current) {
                textareaRef.current.focus();
              }
            }, 1500);
          };
        } catch (error) {
          console.error('Error processing voice:', error);
          toast({
            title: 'Voice Processing Error',
            description: 'We couldn\'t process your voice. Please try again or type your request.',
            variant: 'destructive',
          });
          setIsProcessingVoice(false);
        }
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: 'Recording started',
        description: 'Speak now. Click the microphone again to stop recording.',
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone Error',
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Describe your dream adventure (e.g., 'Weekend hiking trip in Yosemite with waterfalls and moderate trails')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing || isProcessingVoice}
          className="min-h-24 pr-12 resize-none"
        />
        <div className="absolute right-2 bottom-2">
          {prompt.trim() ? (
            <Button
              onClick={handleSubmit}
              disabled={isProcessing || !prompt.trim()}
              size="icon"
              className="rounded-full"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <Button
              onClick={toggleRecording}
              disabled={isProcessing || isProcessingVoice}
              size="icon"
              variant={isRecording ? "destructive" : "default"}
              className="rounded-full"
            >
              {isProcessingVoice ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/25e83a05-acce-4c01-80a9-2c1dcbabab87.png" 
            alt="Voice powered by ElevenLabs" 
            className="h-5 w-5" 
          />
          <span className="text-xs text-gray-500">
            Voice powered by ElevenLabs
          </span>
        </div>
      </div>
      
      {isProcessing && (
        <div className="text-center text-sm text-gray-500 animate-pulse">
          Our AI is crafting your perfect adventure experience...
        </div>
      )}
    </div>
  );
};

export default PromptInput;
