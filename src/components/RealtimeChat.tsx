
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AudioVisualizer from './realtime/AudioVisualizer';
import ChatControls from './realtime/ChatControls';
import ChatHistory from './realtime/ChatHistory';
import ProcessingIndicator from './realtime/ProcessingIndicator';
import { useChatState } from './realtime/useChatState';

const RealtimeChat: React.FC = () => {
  const {
    state,
    message,
    transcript,
    isRecording,
    isMuted,
    history,
    errorMessage,
    showAudioVisualizer,
    setMessage,
    startSession,
    handleSendMessage,
    startRecording,
    stopRecording,
    toggleMute,
    handleKeyDown
  } = useChatState();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Offbeat Adventure Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChatHistory history={history} transcript={transcript} />
        
        {state === 'processing' && <ProcessingIndicator />}
        
        <ChatControls 
          state={state}
          isRecording={isRecording}
          isMuted={isMuted}
          message={message}
          errorMessage={errorMessage}
          onStartSession={startSession}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onToggleMute={toggleMute}
          onMessageChange={(e) => setMessage(e.target.value)}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
        
        {showAudioVisualizer && <AudioVisualizer onClose={stopRecording} />}
      </CardContent>
    </Card>
  );
};

export default RealtimeChat;
