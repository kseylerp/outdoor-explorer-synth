
import React from 'react';
import RealtimeChat from '@/components/RealtimeChat';

const RealtimeChatPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Chat with the Offbeat Adventure Assistant</h1>
      <p className="mb-6 text-gray-600 max-w-3xl">
        Our AI-powered assistant can help you discover unique adventures, plan your trip, and find hidden gems off the beaten path.
        Use your voice or text to interact with the assistant.
      </p>
      <RealtimeChat />
    </div>
  );
};

export default RealtimeChatPage;
