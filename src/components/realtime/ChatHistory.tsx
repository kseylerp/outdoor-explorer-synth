
/**
 * Component to display chat conversation history
 * 
 * Features:
 * - Displays message exchange between user and assistant
 * - Shows current transcript being processed
 * - Handles empty state with welcome message
 * - Visual differentiation between user and assistant messages
 */
import React from 'react';

interface ChatHistoryProps {
  history: {role: 'user' | 'assistant', content: string}[];
  transcript: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history, transcript }) => {
  return (
    <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-auto p-2">
      {history.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>👋 Hi there! I'm your adventure guide.</p>
          <p>Ask me about outdoor adventures, hiking trails, national parks, or unique travel experiences!</p>
        </div>
      )}

      {history.map((msg, index) => (
        <div 
          key={index} 
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      
      {transcript && (
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              {transcript}
              <div className="animate-pulse">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
