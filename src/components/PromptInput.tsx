
import React from 'react';
import VoiceExperience from './prompt/VoiceExperience';
import ResponseDialog from './prompt/ResponseDialog';
import PromptInputContainer from './prompt/PromptInputContainer';
import { usePromptInput } from '@/hooks/usePromptInput';
import { usePromptDialog } from '@/hooks/usePromptDialog';
import { useVoiceResponse } from '@/hooks/useVoiceResponse';
import { PromptInputProps } from './prompt/types';

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  onTranscript,
  isProcessing,
  defaultValue = '',
  placeholder = ''
}) => {
  // Use our custom hooks
  const {
    prompt,
    setPrompt,
    lensFlashActive,
    textareaRef,
    promptBoxRef
  } = usePromptInput(defaultValue);

  const {
    showResponseDialog,
    currentQuestion,
    quickResponseOptions,
    setShowResponseDialog,
    setCurrentQuestion,
    setQuickResponseOptions,
    checkForQuestions
  } = usePromptDialog();

  const {
    showAudioExperience,
    setShowAudioExperience,
    isResponseToQuestion,
    startVoiceExperience
  } = useVoiceResponse();

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

  const handleResponseSubmit = (response: string) => {
    console.log('Dialog response received:', response);
    
    // Set the response to the prompt field
    setPrompt(response);
    
    // Submit the response
    if (response.trim()) {
      onSubmit(response);
      setPrompt('');
    }
    
    // Close the dialog
    setShowResponseDialog(false);
  };

  return (
    <div className="space-y-4 relative">
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
      <PromptInputContainer 
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        isProcessing={isProcessing || showAudioExperience}
        lensFlashActive={lensFlashActive}
        textareaRef={textareaRef}
        promptBoxRef={promptBoxRef}
        onAudioClick={startVoiceExperience}
        placeholder={placeholder}
      />
      
      {isProcessing && (
        <div className="text-center text-base font-patano text-gray-800 animate-pulse">
          Our AI is crafting your perfect adventure experience...
        </div>
      )}
    </div>
  );
};

export default PromptInput;
