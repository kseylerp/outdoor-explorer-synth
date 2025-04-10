import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import { useToast } from '@/hooks/use-toast';
import { AudioWaveform, X } from 'lucide-react';
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
            className="rounded-full hover:bg-purple-100 group relative p-0 w-10 h-10 flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full border-2 border-purple-600 opacity-70"></div>
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
  const [processingComplete, setProcessingComplete] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  
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
                
                // When we get the transcript, don't close yet, wait for AI response
                setAiResponseText("I'm finding the perfect adventure options based on your request...");
                setIsListening(false);
                setProcessingComplete(false);
                
                // Simulate AI response after a delay
                setTimeout(() => {
                  setAiResponseText("I understand you're looking for a weekend trip with hiking. Let me find some great offbeat options for you!");
                  
                  // After AI responds verbally, prepare to generate the trip with the transcript
                  setTimeout(() => {
                    setProcessingComplete(true);
                    // User can now close the experience or keep listening to AI
                  }, 2000);
                }, 1500);
              }
            };
            
            service.onError = (error) => {
              console.error('Realtime audio error:', error);
              toast({
                title: "Error with voice service",
                description: error.message,
                variant: "destructive"
              });
            };
          })
          .catch(error => {
            console.error('Failed to initialize realtime session:', error);
            toast({
              title: "Connection failed",
              description: "Could not connect to the voice service. Please try again.",
              variant: "destructive"
            });
          });
          
        return () => {
          service.disconnect();
        };
      });
    }
  }, [isListening, onTranscript]);

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
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="text-white text-xl font-medium mb-8">
        {isListening ? 'Speak now...' : aiResponseText || 'Processing...'}
      </div>
      
      <div className="flex items-center justify-center gap-1 mb-8">
        {audioVisualizer.map((height, i) => (
          <div 
            key={i}
            className={`w-1.5 rounded-full transition-all duration-200 ${
              isListening ? 'bg-gradient-to-t from-purple-600 to-purple-400' : 'bg-gradient-to-t from-blue-600 to-blue-400'
            }`}
            style={{
              height: `${height}px`,
              animationDuration: `${Math.random() * 1 + 0.5}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-white/70 text-sm max-w-md text-center px-4">
        {isListening 
          ? "What adventure are you looking for? Describe your ideal trip!" 
          : processingComplete 
            ? "Ready to explore your adventure options? Click outside to view them."
            : "I'm processing your request..."}
      </div>
      
      {processingComplete && (
        <button 
          onClick={onClose}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
        >
          Show My Adventure Options
        </button>
      )}
    </div>
  );
};

const toast = {
  title: (title: string) => console.log(title),
  description: (desc: string) => console.log(desc),
  variant: (variant: string) => console.log(variant)
};

export default PromptInput;
