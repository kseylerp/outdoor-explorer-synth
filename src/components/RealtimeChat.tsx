
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
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
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
  
  // Generate follow-up questions based on conversation content
  useEffect(() => {
    if (history.length > 1 && !isProcessing) {
      const lastBotMessage = history.findLast(msg => msg.role === 'assistant' || msg.role === 'system');
      
      if (lastBotMessage) {
        // Generate follow-up questions based on last message content
        const suggestedQuestions = generateFollowUpQuestions(lastBotMessage.content);
        setFollowUpQuestions(suggestedQuestions);
      }
    }
  }, [history, isProcessing]);
  
  const generateFollowUpQuestions = (messageContent: string): string[] => {
    // Very basic question generation - in a real app, this would be more sophisticated
    const questions: string[] = [];
    
    if (messageContent.toLowerCase().includes('hiking')) {
      questions.push("What hiking difficulty level are you comfortable with?");
    }
    
    if (messageContent.toLowerCase().includes('food') || messageContent.toLowerCase().includes('restaurant')) {
      questions.push("Do you have any dietary preferences I should know about?");
    }
    
    if (messageContent.toLowerCase().includes('hotel') || messageContent.toLowerCase().includes('stay')) {
      questions.push("What's your preferred accommodation type?");
    }
    
    // Always add some generic follow-ups if we don't have specific ones
    if (questions.length < 2) {
      questions.push("What else would you like to know about this destination?");
      questions.push("How many people will be traveling with you?");
      questions.push("What's your budget for this trip?");
    }
    
    return questions.slice(0, 3); // Limit to 3 questions
  };

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
  
  const handleFollowUpClick = (question: string) => {
    setMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Adapt the history to match ChatHistory component expectations
  const adaptedHistory = history.map(msg => ({
    role: msg.role === 'system' ? 'assistant' : msg.role, // Convert 'system' to 'assistant' 
    content: msg.content
  }));

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col bg-[#F4F7F3] dark:bg-[#202020]">
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatHistory 
            history={adaptedHistory} 
            transcript={transcript}
            followUpQuestions={followUpQuestions}
            onFollowUpClick={handleFollowUpClick}
          />
        </div>
        
        {isProcessing && <ProcessingIndicator />}
        
        <div className="sticky bottom-0 bg-[#F4F7F3] dark:bg-[#202020] p-4">
          <ChatControls 
            message={message}
            onMessageChange={setMessage}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
            onVoiceStart={() => setShowVoiceExperience(true)}
            isProcessing={isProcessing}
            isRecording={showVoiceExperience}
          />
        </div>
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
