
import React from 'react';
import RealtimeChat from '@/components/RealtimeChat';

const RealtimeChatPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Adventure Assistant</h1>
      <p className="mb-6 text-gray-600 max-w-3xl">
        Chat with our AI-powered adventure assistant to get personalized trip recommendations and travel advice.
      </p>
      <RealtimeChat />
    </div>
  );
};

export default RealtimeChatPage;
