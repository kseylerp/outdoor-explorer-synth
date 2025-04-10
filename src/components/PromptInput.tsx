
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import OpenAIMicButton from './prompt/OpenAIMicButton';

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
  placeholder = 'I would like to do a weekend trip hiking Yosemite on trails with fewer people.' 
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const [showAudioExperience, setShowAudioExperience] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
      // Don't clear the prompt after submission to allow for easy modifications
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
          <OpenAIMicButton 
            onClick={() => setShowAudioExperience(true)}
            disabled={isProcessing}
            isProcessing={isProcessing}
          />
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
  
  // Simulate receiving a transcript after a delay
  React.useEffect(() => {
    if (isListening) {
      const timer = setTimeout(() => {
        setIsListening(false);
        onTranscript("I want to go hiking in Yosemite National Park on some less crowded trails");
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
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
      
      <div className="text-white text-xl font-medium mb-8">Listening...</div>
      
      <div className="flex items-center justify-center gap-1 mb-8">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="w-1.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full animate-pulse"
            style={{
              height: `${Math.random() * 40 + 10}px`,
              animationDuration: `${Math.random() * 1 + 0.5}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-white/70 text-sm">Speak now or click X to cancel</div>
    </div>
  );
};

export default PromptInput;
