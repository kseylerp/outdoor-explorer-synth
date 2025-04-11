
import React from 'react';
import { Button } from '@/components/ui/button';
import { AudioWaveform } from 'lucide-react';

interface AudioButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      size="icon"
      variant="ghost"
      className="rounded-full hover:bg-purple-100 group relative p-0 w-10 h-10 flex items-center justify-center"
    >
      <div className="absolute inset-0 rounded-full border-2 border-purple-600 opacity-70"></div>
      <AudioWaveform className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
      <span className="sr-only">Voice Input</span>
    </Button>
  );
};

export default AudioButton;
