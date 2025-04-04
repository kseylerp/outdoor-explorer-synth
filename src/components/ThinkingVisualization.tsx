
import React from 'react';

interface ThinkingStep {
  text: string;
  timestamp: string;
}

interface ThinkingVisualizationProps {
  thinkingSteps: ThinkingStep[];
  isVisible: boolean;
}

const ThinkingVisualization: React.FC<ThinkingVisualizationProps> = ({ thinkingSteps, isVisible }) => {
  if (!isVisible || !thinkingSteps || thinkingSteps.length === 0) {
    return null;
  }

  // Take the latest thinking step to display
  const latestStep = thinkingSteps[thinkingSteps.length - 1];
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 animate-pulse">
      <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.5 7.5V7.501" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        AI is planning your adventure...
      </h3>
      <div className="bg-white rounded p-3 text-sm text-gray-700 leading-relaxed">
        {latestStep.text}
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-purple-700">
          Thinking through {thinkingSteps.length} steps so far...
        </div>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-1.5 rounded-full ${i < (thinkingSteps.length % 5) ? 'bg-purple-600' : 'bg-purple-200'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThinkingVisualization;
