
import React from 'react';
import RealtimeChat from '@/components/RealtimeChat';

const RealtimeChatPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Chat with the Offbeat Adventure Assistant</h1>
      <p className="mb-6 text-gray-600 max-w-3xl">
        This assistant uses OpenAI's Realtime API to provide audio and text responses about offbeat adventure travel. 
        You can type messages or use voice to communicate with the AI.
      </p>
      <RealtimeChat />
    </div>
  );
};

export default RealtimeChatPage;
