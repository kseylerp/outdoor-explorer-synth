
/**
 * Component for real-time chat functionality
 * 
 * Features:
 * - Message history display
 * - Input controls for sending messages
 * - Voice input capability
 * - Processing indicator during AI responses
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useChatState } from './realtime/useChatState';
import ChatHistory from './realtime/ChatHistory';
import ChatControls from './realtime/ChatControls';
import ProcessingIndicator from './realtime/ProcessingIndicator';
import VoiceExperience from './prompt/VoiceExperience';
import { useToast } from '@/hooks/use-toast';

const RealtimeChat: React.FC = () => {
  const { 
    state, 
    message, 
    setMessage, 
    history,
    handleSendMessage,
    isProcessing,
    transcript: pendingTranscript
  } = useChatState();
  
  const [transcript, setTranscript] = useState('');
  const [showVoiceExperience, setShowVoiceExperience] = useState(false);
  const { toast } = useToast();
  
  // Handle potential errors in chat state
  useEffect(() => {
    if (state === 'error') {
      toast({
        title: "Connection Error",
        description: "There was an error connecting to the chat service. Please try again.",
        variant: "destructive"
      });
    }
  }, [state, toast]);

  // Update local transcript when pending transcript changes
  useEffect(() => {
    if (pendingTranscript) {
      setTranscript(pendingTranscript);
    }
  }, [pendingTranscript]);
  
  const handleSend = () => {
    if (message.trim()) {
      handleSendMessage();
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
      setMessage(text);
      handleSendMessage();
    }
    setShowVoiceExperience(false);
  };

  // Adapt the history to match ChatHistory component expectations
  const adaptedHistory = history.map(msg => ({
    role: msg.role === 'system' ? 'assistant' : msg.role, // Convert 'system' to 'assistant' 
    content: msg.content
  }));

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatHistory 
            history={adaptedHistory} 
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
