
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface SendButtonProps {
  onSubmit: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ onSubmit, isProcessing, disabled }) => {
  return (
    <Button
      onClick={onSubmit}
      disabled={disabled || isProcessing}
      size="icon"
      className="rounded-full bg-[#9870FF] hover:bg-[#7E69AB]"
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SendButton;
