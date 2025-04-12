
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChatHistoryProps {
  history: Array<{ role: string; content: string }>;
  transcript?: string;
  followUpQuestions?: string[];
  onFollowUpClick?: (question: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  history,
  transcript,
  followUpQuestions = [],
  onFollowUpClick
}) => {
  return (
    <div className="space-y-6">
      {history.map((message, index) => (
        <div 
          key={index} 
          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role !== 'user' && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/lovable-uploads/9f6d8016-f016-4bc2-b123-529e15a7164a.png" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
          
          <div className="max-w-[80%]">
            <div
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-[#65558F] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            
            {/* Follow-up questions shown after AI responses */}
            {message.role === 'assistant' && index === history.length - 1 && followUpQuestions.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 ml-1">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {followUpQuestions.map((question, qIndex) => (
                    <Button 
                      key={qIndex} 
                      variant="outline" 
                      size="sm" 
                      className="bg-gray-100 dark:bg-gray-800 text-xs px-3 py-1 h-auto"
                      onClick={() => onFollowUpClick?.(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {message.role === 'user' && (
            <Avatar className="h-8 w-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      
      {transcript && (
        <div className="flex justify-end gap-3">
          <div className="max-w-[80%] bg-gray-200 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Transcribing...
              </Badge>
            </div>
            <p>{transcript}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
