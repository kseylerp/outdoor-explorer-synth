
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Mic } from 'lucide-react';
import { useAgentConversation } from '@/hooks/useAgentConversation';
import { AgentAction } from '@/agents/types';
import VoiceInput from '@/components/agent/VoiceInput';

interface AgentChatProps {
  title?: string;
  onAction?: (action: AgentAction) => void;
}

const AgentChat: React.FC<AgentChatProps> = ({
  title = "Adventure Assistant",
  onAction,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    activeAgent
  } = useAgentConversation({ onAction });
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };
  
  const handleVoiceInput = async (transcript: string) => {
    setShowVoiceInput(false);
    if (transcript.trim()) {
      await sendMessage(transcript);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          {activeAgent && (
            <span className="text-xs font-normal bg-muted px-2 py-1 rounded-full">
              {activeAgent} agent
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[450px] pr-4">
          <div className="flex flex-col space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>👋 Hi there! How can I help plan your adventure today?</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-center">
                <div className="max-w-[80%] rounded-lg p-3 bg-destructive/10 text-destructive">
                  {error}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-2">
        {showVoiceInput ? (
          <VoiceInput 
            onTranscript={handleVoiceInput}
            onCancel={() => setShowVoiceInput(false)} 
          />
        ) : (
          <div className="flex w-full items-center space-x-2">
            <Textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-10 flex-1"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              disabled={isLoading} 
              onClick={() => setShowVoiceInput(true)}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              disabled={!inputValue.trim() || isLoading} 
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AgentChat;
