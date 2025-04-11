import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import AudioButton from './prompt/AudioButton';
import VoiceExperience from './prompt/VoiceExperience';
import { useToast } from '@/hooks/use-toast';
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
  placeholder = ''
}) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const [showAudioExperience, setShowAudioExperience] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    toast
  } = useToast();
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
      
      <div className="relative border border-gray-200 rounded-md p-4 bg-[#2c2458] py-[24px] mx-[24px] px-0">
        <Textarea ref={textareaRef} placeholder="" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={handleKeyDown} disabled={isProcessing || showAudioExperience} className="min-h-24 pr-12 mb-2 resize-none font-patano text-base w-full border-0 focus:ring-0 focus-visible:ring-0 text-white placeholder:text-gray-400 bg-[#2c2458]" />
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
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