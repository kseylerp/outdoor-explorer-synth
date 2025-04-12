
/**
 * Component for real-time chat functionality
 * 
 * Features:
 * - Message history display
 * - Input controls for sending messages
 * - Voice input capability
 * - Processing indicator during AI responses
 */
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useChatState } from './realtime/useChatState';
import ChatHistory from './realtime/ChatHistory';
import ChatControls from './realtime/ChatControls';
import ProcessingIndicator from './realtime/ProcessingIndicator';
import VoiceExperience from './prompt/VoiceExperience';

const RealtimeChat: React.FC = () => {
  const { state, sendMessage, isProcessing } = useChatState();
  const [message, setMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showVoiceExperience, setShowVoiceExperience] = useState(false);
  
  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setTranscript('');
    if (text.trim()) {
      sendMessage(text);
    }
    setShowVoiceExperience(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatHistory 
            history={state.messages} 
            transcript={transcript} 
          />
        </div>
        
        {isProcessing && <ProcessingIndicator />}
        
        <ChatControls 
          message={message}
          onMessageChange={setMessage}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          onVoiceStart={() => setShowVoiceExperience(true)}
          isProcessing={isProcessing}
          isRecording={showVoiceExperience}
        />
      </CardContent>
      
      {showVoiceExperience && (
        <VoiceExperience 
          onClose={() => setShowVoiceExperience(false)}
          onTranscript={handleVoiceTranscript}
        />
      )}
    </Card>
  );
};

export default RealtimeChat;
