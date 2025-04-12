
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SendButton from './prompt/SendButton';
import AudioButton from './prompt/AudioButton';
import VoiceExperience from './prompt/VoiceExperience';
import ResponseDialog from './prompt/ResponseDialog';
import { useToast } from '@/hooks/use-toast';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  onTranscript?: (transcript: string, tripData?: any) => void;
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
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [quickResponseOptions, setQuickResponseOptions] = useState<Array<{text: string, value: string}>>([]);
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
      
      // Clear the prompt after submission
      setPrompt('');
      
      // Check for potential follow-up questions in the prompt
      checkForQuestions(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (transcript: string, tripData?: any) => {
    console.log(`Handling voice transcript: "${transcript}"`);
    
    if (!transcript.trim()) {
      console.warn('Empty transcript received');
      return;
    }
    
    // Update the prompt field with the transcript
    setPrompt(transcript);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Open dialog for follow-up questions if this seems to be a response to a question
    // (Don't open dialog for initial prompts)
    if (isResponseToQuestion(transcript)) {
      setCurrentQuestion('Continue the conversation');
      setQuickResponseOptions([]);
      setShowResponseDialog(true);
    } else {
      // If this is an initial prompt, submit it directly
      if (onTranscript) {
        onTranscript(transcript, tripData);
      }
    }
  };

  // Check if text appears to be a response to a question rather than a new prompt
  const isResponseToQuestion = (text: string): boolean => {
    // Common response patterns
    const responsePatterns = [
      /^yes/i,
      /^no/i,
      /^definitely/i,
      /^I'd like/i,
      /^I am/i,
      /^I prefer/i,
      /^Sounds good/i,
      /^That works/i,
      /^I'll/i,
      /^We'll/i
    ];
    
    return responsePatterns.some(pattern => pattern.test(text.trim()));
  }

  // Check if the prompt might contain questions that need follow-up
  const checkForQuestions = (text: string) => {
    // Very basic question detection for demo
    if (text.includes('?')) {
      setTimeout(() => {
        setCurrentQuestion("Would you like to add more details to your request?");
        setQuickResponseOptions([
          { text: "Yes", value: "Yes, I'd like to provide more details." },
          { text: "No", value: "No, that's all I need to know." }
        ]);
        setShowResponseDialog(true);
      }, 1000);
    }
  };

  const startVoiceExperience = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('Requesting microphone permissions...');
      // Check if we have microphone permissions before showing the UI
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(() => {
        console.log('Microphone permissions granted, starting voice experience');
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
      console.error('MediaDevices API not supported');
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input.',
        variant: 'destructive'
      });
    }
  };

  const handleResponseSubmit = (response: string) => {
    console.log('Dialog response received:', response);
    
    // Set the response to the prompt field
    setPrompt(response);
    
    // Submit the response
    if (response.trim()) {
      onSubmit(response);
      setPrompt('');
    }
  };

  return <div className="space-y-4 relative">
      {/* Voice Experience Modal */}
      {showAudioExperience && (
        <VoiceExperience 
          onClose={() => setShowAudioExperience(false)} 
          onTranscript={handleVoiceTranscript} 
        />
      )}
      
      {/* Response Dialog */}
      <ResponseDialog 
        isOpen={showResponseDialog}
        onClose={() => setShowResponseDialog(false)}
        question={currentQuestion}
        onSubmit={handleResponseSubmit}
        options={quickResponseOptions}
      />
      
      {/* Main Prompt Input */}
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
