
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import AudioButton from './prompt/AudioButton';
import VoiceExperience from './prompt/VoiceExperience';
import { useToast } from '@/hooks/use-toast';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  onTranscript?: (transcript: string, tripData?: any) => void; // Added this prop
  isProcessing: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  onTranscript,
  isProcessing,
  defaultValue = '',
  placeholder = ''
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const [showAudioExperience, setShowAudioExperience] = useState(false);
  const [lensFlashActive, setLensFlashActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptBoxRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();

  // Trigger lens flash effect when user types
  useEffect(() => {
    if (prompt) {
      setLensFlashActive(true);
      const timer = setTimeout(() => setLensFlashActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [prompt]);

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

  const handleVoiceTranscript = (transcript: string, tripData?: any) => {
    setPrompt(transcript);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Call the onTranscript prop if provided
    if (onTranscript) {
      onTranscript(transcript, tripData);
    }
  };

  const startVoiceExperience = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Check if we have microphone permissions before showing the UI
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(() => {
        setShowAudioExperience(true);
      }).catch(err => {
        console.error('Error accessing microphone:', err);
        toast({
          title: 'Microphone access denied',
          description: 'Please allow microphone access to use voice features.',
          variant: 'destructive'
        });
      });
    } else {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input.',
        variant: 'destructive'
      });
    }
  };

  return <div className="space-y-4 relative">
      {showAudioExperience && <VoiceExperience onClose={() => setShowAudioExperience(false)} onTranscript={handleVoiceTranscript} />}
      
      <div 
        ref={promptBoxRef}
        className={`relative border border-gray-200 rounded-md p-4 bg-[#0c0c0c] py-[24px] mx-[24px] ${lensFlashActive ? 'lens-flash' : ''}`}
      >
        <Textarea 
          ref={textareaRef} 
          placeholder={placeholder}
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          onKeyDown={handleKeyDown} 
          disabled={isProcessing || showAudioExperience} 
          className="min-h-24 pr-20 mb-2 resize-none font-patano text-base w-full border-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none text-white placeholder:text-gray-400 bg-[#0c0c0c] px-3" 
        />
        <div className="absolute right-5 bottom-5 flex items-center gap-2">
          <AudioButton onClick={startVoiceExperience} disabled={isProcessing} />
          <SendButton onSubmit={handleSubmit} isProcessing={isProcessing} disabled={!prompt.trim()} />
        </div>
      </div>
      
      {isProcessing && <div className="text-center text-base font-patano text-gray-800 animate-pulse">
          Our AI is crafting your perfect adventure experience...
        </div>}
    </div>;
};

export default PromptInput;
