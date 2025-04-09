
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import VoiceRecordingButton from './prompt/VoiceRecordingButton';

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

  const handleVoiceTranscript = (transcript: string) => {
    setPrompt(transcript);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="min-h-24 pr-12 resize-none font-patano text-base"
        />
        <div className="absolute right-2 bottom-2">
          {prompt.trim() ? (
            <SendButton 
              onSubmit={handleSubmit} 
              isProcessing={isProcessing} 
              disabled={!prompt.trim()}
            />
          ) : (
            <VoiceRecordingButton 
              onTranscriptReceived={handleVoiceTranscript}
              disabled={isProcessing}
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

export default PromptInput;
