/**
 * Container component for the prompt input interface
 * 
 * This component encapsulates:
 * - Text input area for prompts
 * - Send button for submitting
 * - Audio button for voice input
 * - Visual feedback (lens flash effect)
 * - Loading state handling
 */
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './SendButton';
import AudioButton from './AudioButton';

interface PromptInputContainerProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  lensFlashActive: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  promptBoxRef: React.RefObject<HTMLDivElement>;
  onAudioClick: () => void;
  placeholder?: string;
}

const PromptInputContainer: React.FC<PromptInputContainerProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  onKeyDown,
  isProcessing,
  lensFlashActive,
  textareaRef,
  promptBoxRef,
  onAudioClick,
  placeholder = ''
}) => {
  return (
    <div 
      ref={promptBoxRef}
      className={`relative border border-gray-200 rounded-md p-4 bg-[#E9ECE8] py-[24px] mx-[24px] ${lensFlashActive ? 'lens-flash' : ''}`}
    >
      <Textarea 
        ref={textareaRef} 
        placeholder={placeholder}
        value={prompt} 
        onChange={e => setPrompt(e.target.value)} 
        onKeyDown={onKeyDown} 
        disabled={isProcessing} 
        className="min-h-24 pr-20 mb-2 resize-none font-patano text-base w-full border-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none text-white placeholder:text-gray-400 bg-[#E9ECE8] px-3" 
      />
      <div className="absolute right-5 bottom-5 flex items-center gap-2">
        <AudioButton onClick={onAudioClick} disabled={isProcessing} />
        <SendButton onSubmit={onSubmit} isProcessing={isProcessing} disabled={!prompt.trim()} />
      </div>
    </div>
  );
};

export default PromptInputContainer;
