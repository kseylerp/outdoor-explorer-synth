
/**
 * Component that visualizes audio input with animated bars
 * 
 * Features:
 * - Visual feedback for active listening state
 * - Animated bars that simulate audio levels
 * - Different colors for different states
 */
import React, { useState, useEffect } from 'react';

interface AudioVisualizerProps {
  isListening: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening }) => {
  const [audioVisualizer, setAudioVisualizer] = useState<number[]>(Array(20).fill(10));

  // Create animated audio visualization when listening
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioVisualizer(Array(20).fill(0).map(() => Math.random() * 40 + 10));
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {audioVisualizer.map((height, i) => (
        <div 
          key={i}
          className={`w-1.5 rounded-full transition-all duration-200 ${
            isListening ? 'bg-gradient-to-t from-purple-600 to-purple-400' : 'bg-gradient-to-t from-blue-600 to-blue-400'
          }`}
          style={{
            height: `${height}px`,
            animationDuration: `${Math.random() * 1 + 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
