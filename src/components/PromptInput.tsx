
/**
 * Main prompt input component that integrates all prompt functionality
 * 
 * Features:
 * - Text input for user prompts
 * - Voice input capability
 * - Response dialog for follow-up questions
 * - Processing state visualization
 * - Integration with various prompt-related hooks
 */
import React from 'react';
import VoiceExperience from './prompt/VoiceExperience';
import PromptResponseDialog from './prompt/PromptResponseDialog';
import PromptInputContainer from './prompt/PromptInputContainer';
import { usePromptInput } from '@/hooks/usePromptInput';
import { usePromptDialog } from '@/hooks/usePromptDialog';
import { usePromptVoice } from '@/hooks/usePromptVoice';
import { usePromptSubmission } from '@/hooks/usePromptSubmission';
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
    checkForQuestions
  } = usePromptDialog();

  const {
    showAudioExperience,
    setShowAudioExperience,
    handleVoiceTranscript,
    startVoiceExperience
  } = usePromptVoice(onTranscript);
  
  const { handleSubmit, handleKeyDown } = usePromptSubmission(
    prompt,
    (trimmedPrompt) => {
      if (!isProcessing) {
        onSubmit(trimmedPrompt);
        checkForQuestions(trimmedPrompt);
      }
    },
    setPrompt
  );

  /**
   * Handle responses from the dialog component
   * @param response - The user's response text
   */
  const handleResponseSubmit = (response: string) => {
    console.log('Dialog response received:', response);
    
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
      <PromptResponseDialog 
        showResponseDialog={showResponseDialog}
        currentQuestion={currentQuestion}
        quickResponseOptions={quickResponseOptions}
        setShowResponseDialog={setShowResponseDialog}
        onResponseSubmit={handleResponseSubmit}
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
