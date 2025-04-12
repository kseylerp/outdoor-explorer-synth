
import React from 'react';
import { useChatState } from '@/components/realtime/useChatState';
import ChatHistory from '@/components/realtime/ChatHistory';
import ChatControls from '@/components/realtime/ChatControls';
import ProcessingIndicator from '@/components/realtime/ProcessingIndicator';
import AudioVisualizer from '@/components/prompt/voice/AudioVisualizer';

export default function RealtimeChat() {
  const {
    state,
    message,
    transcript,
    isRecording,
    history,
    errorMessage,
    showAudioVisualizer,
    audioLevel,
    setMessage,
    startSession,
    handleSendMessage,
    startRecording,
    stopRecording,
    toggleMute,
    handleKeyDown
  } = useChatState();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto pb-32">
        {/* Using spread operator to pass all props to avoid type errors */}
        <ChatHistory messages={history} />
      </div>

      {showAudioVisualizer && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2">
          <AudioVisualizer isListening={isRecording} />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto p-4 max-w-3xl">
          {errorMessage && (
            <div className="text-destructive mb-2 text-sm">
              Error: {errorMessage}
            </div>
          )}

          {/* Using spread operator to pass all props to avoid type errors */}
          <ProcessingIndicator state={state} transcript={transcript} />
          <ChatControls
            message={message}
            setMessage={setMessage}
            onSend={handleSendMessage}
            onKeyDown={handleKeyDown}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onToggleMute={toggleMute}
            onStartSession={startSession}
            state={state}
            isRecording={isRecording}
          />
        </div>
      </div>
    </div>
  );
}
