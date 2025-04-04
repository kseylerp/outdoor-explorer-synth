
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
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-medium text-purple-700 mb-2">AI Thinking Process</h3>
      <div className="space-y-3">
        {thinkingSteps.map((step, index) => (
          <div key={index} className="text-sm text-gray-700">
            <span className="font-semibold text-purple-600">Step {index + 1}:</span>
            <p className="mt-1 whitespace-pre-line">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThinkingDisplay;
