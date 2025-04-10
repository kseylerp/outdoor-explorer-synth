
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import { useToast } from '@/hooks/use-toast';
import { AudioWaveform } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isProcessing, 
  defaultValue = '', 
  placeholder = '',
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const [showAudioExperience, setShowAudioExperience] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

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

  const handleVoiceTranscript = (transcript: string) => {
    setPrompt(transcript);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const startVoiceExperience = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Check if we have microphone permissions before showing the UI
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setShowAudioExperience(true);
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          toast({
            title: 'Microphone access denied',
            description: 'Please allow microphone access to use voice features.',
            variant: 'destructive',
          });
        });
    } else {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 relative">
      {showAudioExperience && (
        <AudioExperience 
          onClose={() => setShowAudioExperience(false)}
          onTranscript={handleVoiceTranscript}
        />
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing || showAudioExperience}
          className="min-h-24 pr-12 resize-none font-patano text-base"
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <Button 
            onClick={startVoiceExperience}
            disabled={isProcessing}
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-purple-100 group"
          >
            <AudioWaveform className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="sr-only">Voice Input</span>
          </Button>
          
          {prompt.trim() && (
            <SendButton 
              onSubmit={handleSubmit} 
              isProcessing={isProcessing} 
              disabled={!prompt.trim()}
            />
          )}
        </div>
      </div>
      
      {isProcessing && (
        <div className="text-center text-base font-patano text-gray-800 animate-pulse">
          Our AI is crafting your perfect adventure experience...
        </div>
      )}
    </div>
  );
};

interface AudioExperienceProps {
  onClose: () => void;
  onTranscript: (text: string) => void;
}

const AudioExperience: React.FC<AudioExperienceProps> = ({ onClose, onTranscript }) => {
  const [isListening, setIsListening] = useState(true);
  const [audioVisualizer, setAudioVisualizer] = useState<number[]>(Array(20).fill(10));
  
  // Create animated audio visualization
  React.useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioVisualizer(Array(20).fill(0).map(() => Math.random() * 40 + 10));
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isListening]);
  
  // Connect to the OpenAI Realtime API and start listening
  React.useEffect(() => {
    if (isListening) {
      // Initialize WebRTC connection to OpenAI Realtime API
      import('@/components/realtime/RealtimeAudioService').then(({ RealtimeAudioService }) => {
        const service = new RealtimeAudioService();
        
        service.initSession()
          .then((sessionId) => {
            console.log('Realtime session started with ID:', sessionId);
            
            service.onTranscriptReceived = (transcript) => {
              if (transcript && transcript.trim()) {
                onTranscript(transcript);
                onClose();
              }
            };
            
            service.onError = (error) => {
              console.error('Realtime audio error:', error);
              onClose();
            };
          })
          .catch(error => {
            console.error('Failed to initialize realtime session:', error);
            onClose();
          });
          
        return () => {
          service.disconnect();
        };
      });
    }
  }, [isListening, onTranscript, onClose]);
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
      
      <div className="text-white text-xl font-medium mb-8">Speak now...</div>
      
      <div className="flex items-center justify-center gap-1 mb-8">
        {audioVisualizer.map((height, i) => (
          <div 
            key={i}
            className="w-1.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full"
            style={{
              height: `${height}px`,
              animationDuration: `${Math.random() * 1 + 0.5}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-white/70 text-sm">What adventure are you looking for?</div>
    </div>
  );
};

export default PromptInput;
