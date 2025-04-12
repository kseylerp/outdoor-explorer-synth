
/**
 * Controls for chat interaction
 * 
 * Features:
 * - Text input with message composition
 * - Send button
 * - Voice recording button
 * - Status indicators
 */
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Mic } from 'lucide-react';

interface ChatControlsProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onVoiceStart: () => void;
  isProcessing: boolean;
  isRecording: boolean;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  message,
  onMessageChange,
  onSend,
  onKeyDown,
  onVoiceStart,
  isProcessing,
  isRecording
}) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-[#E9ECE8] dark:bg-[#222222] rounded-b-lg">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isProcessing || isRecording}
          placeholder="Type your message..."
          className="pr-24 resize-none font-patano text-base w-full border-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none text-gray-800 dark:text-white placeholder:text-gray-400 bg-[#E9ECE8] dark:bg-[#222222]"
          rows={2}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <Button
            onClick={onVoiceStart}
            disabled={isProcessing || isRecording}
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
          >
            <Mic className="h-5 w-5 text-purple-600" />
          </Button>
          <Button
            onClick={onSend}
            disabled={!message.trim() || isProcessing || isRecording}
            size="icon"
            className="rounded-full bg-[#9870FF] hover:bg-[#7E69AB]"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatControls;
