
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, SendHorizonal, Volume2, VolumeX, AudioWaveform } from 'lucide-react';

export type ChatState = 'idle' | 'connecting' | 'connected' | 'recording' | 'processing' | 'error';

interface ChatControlsProps {
  state: ChatState;
  isRecording: boolean;
  isMuted: boolean;
  message: string;
  errorMessage: string | null;
  onStartSession: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleMute: () => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  state,
  isRecording,
  isMuted,
  message,
  errorMessage,
  onStartSession,
  onStartRecording,
  onStopRecording,
  onToggleMute,
  onMessageChange,
  onSendMessage,
  onKeyDown
}) => {
  
  switch (state) {
    case 'idle':
      return (
        <div className="flex flex-col items-center gap-4">
          <Button 
            onClick={onStartSession} 
            className="flex items-center gap-2 text-lg px-6 py-2 h-12"
          >
            <AudioWaveform className="h-5 w-5" />
            Start Voice Adventure
          </Button>
          <p className="text-sm text-muted-foreground">
            Speak with our AI adventure guide to plan your next trip
          </p>
        </div>
      );
      
    case 'connecting':
      return (
        <Button disabled className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting to assistant...
        </Button>
      );
      
    case 'connected':
    case 'recording':
    case 'processing':
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={isRecording ? "bg-red-100" : ""}
            disabled={state === 'processing'}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </Button>
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={onMessageChange}
            onKeyDown={onKeyDown}
            className="min-h-9 flex-1"
            disabled={state === 'processing' || isRecording}
          />
          <Button
            size="icon"
            onClick={onSendMessage}
            disabled={!message.trim() || state === 'processing' || isRecording}
          >
            <SendHorizonal />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
      );
      
    case 'error':
      return (
        <div className="space-y-2">
          <p className="text-sm text-red-500">{errorMessage}</p>
          <Button onClick={onStartSession}>Retry Connection</Button>
        </div>
      );
      
    default:
      return null;
  }
};

export default ChatControls;
