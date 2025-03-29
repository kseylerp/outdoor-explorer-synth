
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  const handleVoiceInput = (transcript: string) => {
    setPrompt(transcript);
  };

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full flex-1">
          <Textarea
            placeholder="Describe your dream adventure (e.g., 'Weekend hiking trip in Yosemite with waterfalls and moderate trails')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="min-h-24 resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="flex gap-2 items-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Plan Adventure
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <VoiceInput 
            onTranscript={handleVoiceInput} 
            isProcessing={isProcessing} 
          />
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
