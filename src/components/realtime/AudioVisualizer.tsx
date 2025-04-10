
import React from 'react';

interface AudioVisualizerProps {
  onClose: () => void;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ onClose }) => {
  const barCount = 20;
  const bars = Array(barCount).fill(0).map((_, i) => ({
    height: Math.random() * 40 + 10,
    animationDuration: Math.random() * 1 + 0.5
  }));
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
      
      <div className="text-white text-xl font-medium mb-8">Speak now...</div>
      
      <div className="flex items-center justify-center gap-1 mb-8">
        {bars.map((bar, i) => (
          <div 
            key={i}
            className="w-1.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full animate-pulse"
            style={{
              height: `${bar.height}px`,
              animationDuration: `${bar.animationDuration}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-white/70 text-sm">What adventure are you looking for?</div>
    </div>
  );
};

export default AudioVisualizer;
