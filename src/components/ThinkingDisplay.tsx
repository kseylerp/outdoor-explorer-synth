
import React from 'react';

interface ThinkingDisplayProps {
  thinkingSteps?: string[];
  isVisible: boolean;
}

const ThinkingDisplay: React.FC<ThinkingDisplayProps> = ({ thinkingSteps, isVisible }) => {
  if (!isVisible || !thinkingSteps || thinkingSteps.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-medium text-purple-700 dark:text-purple-400 mb-2">Processing Your Request</h3>
      <div className="space-y-3">
        {thinkingSteps.map((step, index) => (
          <div key={index} className="text-sm text-gray-700 dark:text-gray-300 animate-pulse-slow">
            <span className="font-semibold text-purple-600 dark:text-purple-400">Step {index + 1}:</span>
            <p className="mt-1 whitespace-pre-line">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThinkingDisplay;
