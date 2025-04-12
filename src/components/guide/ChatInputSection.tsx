
import React, { useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputSectionProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onImageUpload: () => void;
  isSubmitting: boolean;
}

const ChatInputSection: React.FC<ChatInputSectionProps> = ({
  message,
  setMessage,
  onSendMessage,
  onImageUpload,
  isSubmitting
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="relative">
      <Textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="pr-24 resize-none"
        rows={3}
        disabled={isSubmitting}
      />
      <div className="absolute bottom-2 right-2 flex space-x-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={() => {
            if (fileInputRef.current?.files?.length) {
              const newFiles = Array.from(fileInputRef.current.files);
              onImageUpload();
            }
          }}
          className="hidden"
          accept="image/*"
          multiple
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8"
          disabled={isSubmitting}
        >
          <Paperclip size={18} />
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={onSendMessage}
          className="h-8 w-8"
          disabled={isSubmitting || !message.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputSection;
