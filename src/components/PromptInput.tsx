
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import VoiceInput from './VoiceInput';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
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

  const handleTranscript = (text: string) => {
    setPrompt(text);
    setShowVoiceInput(false);
    
    // Focus the textarea after receiving transcript
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleVoiceInput = () => {
    setShowVoiceInput(!showVoiceInput);
  };

  // If voice input is showing, focus the textarea when it closes
  useEffect(() => {
    if (!showVoiceInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showVoiceInput]);

  return (
    <div className="space-y-4">
      {showVoiceInput ? (
        <div className="flex flex-col items-center">
          <VoiceInput onTranscript={handleTranscript} isProcessing={isProcessing} />
          <Button 
            onClick={() => setShowVoiceInput(false)}
            variant="ghost" 
            className="mt-2"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Describe your dream adventure (e.g., 'Weekend hiking trip in Yosemite with waterfalls and moderate trails')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="min-h-24 pr-12 resize-none"
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <Button
              onClick={toggleVoiceInput}
              disabled={isProcessing}
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </Button>
            
            {prompt.trim() && (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing || !prompt.trim()}
                size="icon"
                className="rounded-full bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="text-center text-sm text-gray-500 animate-pulse">
          Our AI is crafting your perfect adventure experience...
        </div>
      )}
    </div>
  );
};

export default PromptInput;
