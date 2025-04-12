
import React from 'react';

interface WelcomeHeaderProps {
  hasSubmittedPrompt: boolean;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ hasSubmittedPrompt }) => {
  if (hasSubmittedPrompt) return null;
  
  return (
    <div className="mb-8 text-center my-[20px] mx-0">
      <h1 className="text-4xl font-bold mb-4 py-0 mx-[2px] md:text-5xl my-px">
        Let's find an <span className="offbeat-gradient">offbeat</span> adventure
      </h1>
      <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-200 text-base my-0">
        Powered by local guides: explore, plan, and experience better trips
      </p>
    </div>
  );
};

export default WelcomeHeader;
