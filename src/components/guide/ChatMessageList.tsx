
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatMessage } from '@/hooks/useGuideChat';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`mb-4 ${msg.isAI ? 'mr-12' : 'ml-12'}`}
        >
          <Card 
            className={`p-3 ${msg.isAI 
              ? 'bg-white dark:bg-gray-800 border-gray-200' 
              : 'bg-primary text-primary-foreground'}`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </Card>
          <div className={`text-xs mt-1 text-gray-500 ${msg.isAI ? 'text-left' : 'text-right'}`}>
            {msg.isAI ? 'Guide AI' : 'You'} • {msg.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
