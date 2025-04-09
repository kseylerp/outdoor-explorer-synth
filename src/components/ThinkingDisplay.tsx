
import React, { useEffect, useState } from 'react';

interface ThinkingDisplayProps {
  thinkingSteps?: string[];
  isVisible: boolean;
}

const ThinkingDisplay: React.FC<ThinkingDisplayProps> = ({ thinkingSteps, isVisible }) => {
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isVisible || !thinkingSteps || thinkingSteps.length === 0) {
      setVisibleSteps([]);
      return;
    }
    
    // Progressive reveal of thinking steps for better UX
    const revealSteps = async () => {
      const newVisibleSteps: string[] = [];
      
      for (let i = 0; i < thinkingSteps.length; i++) {
        newVisibleSteps.push(thinkingSteps[i]);
        setVisibleSteps([...newVisibleSteps]);
        
        // Add a slight delay between steps to create a "thinking" effect
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    };
    
    revealSteps();
  }, [thinkingSteps, isVisible]);
  
  if (!isVisible || !thinkingSteps || thinkingSteps.length === 0 || visibleSteps.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-medium text-purple-700 mb-2">
        AI Thinking Process
        <span className="ml-2 inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
      </h3>
      <div className="space-y-3">
        {visibleSteps.map((step, index) => (
          <div 
            key={index} 
            className={`text-sm text-gray-700 transition-opacity duration-500 ease-in`}
            style={{ opacity: 1 }}
          >
            <span className="font-semibold text-purple-600">Step {index + 1}:</span>
            <p className="mt-1 whitespace-pre-line">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThinkingDisplay;
