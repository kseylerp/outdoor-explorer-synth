
/**
 * Component for chat input controls in the realtime chat interface
 * 
 * Features:
 * - Text input area
 * - Voice recording button
 * - Send button
 * - Processing state handling
 */
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Mic, Loader2 } from "lucide-react";

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
    <div className="border-t p-4 flex items-end gap-2">
      <Textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isProcessing || isRecording}
        placeholder="Ask about adventures, destinations, or trip ideas..."
        className="min-h-[80px] resize-none"
      />
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onVoiceStart} 
          size="icon" 
          variant="outline"
          disabled={isProcessing || isRecording}
        >
          <Mic className="h-4 w-4" />
          <span className="sr-only">Voice input</span>
        </Button>
        
        <Button 
          onClick={onSend} 
          size="icon"
          disabled={isProcessing || !message.trim() || isRecording}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatControls;
