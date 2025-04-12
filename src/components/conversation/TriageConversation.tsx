
import React from 'react';
import TriageResponseBubble from '@/components/prompt/TriageResponseBubble';

interface TriageConversationProps {
  messages: Array<{content: string, isUser: boolean}>;
  pendingBotMessage: string | null;
}

const TriageConversation: React.FC<TriageConversationProps> = ({
  messages,
  pendingBotMessage
}) => {
  if (messages.length === 0) return null;
  
  return (
    <div className="mb-4">
      {messages.map((message, index) => (
        <TriageResponseBubble 
          key={index}
          message={message.content}
          isUser={message.isUser}
        />
      ))}
      {pendingBotMessage !== null && (
        <TriageResponseBubble 
          message="..."
          isUser={false}
          isLoading={true}
        />
      )}
    </div>
  );
};

export default TriageConversation;
