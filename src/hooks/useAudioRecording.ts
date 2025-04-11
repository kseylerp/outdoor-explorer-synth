
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioVisualizer, setShowAudioVisualizer] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([]);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Set up audio analyzer for visualizer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;
      
      // Start visualization loop
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const updateVisualizer = () => {
        if (analyzerRef.current) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          // Get average level for visualization
          const average = Array.from(dataArray)
            .slice(0, 20)
            .map(value => value / 2);
          setAudioLevel(average);
        }
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      
      updateVisualizer();
      
      setIsRecording(true);
      setShowAudioVisualizer(true);
      
      toast({
        title: "Microphone active",
        description: "Speak now. The assistant will respond when you pause.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    // Stop all tracks in the media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Stop the animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset the analyzer
    analyzerRef.current = null;
    
    setIsRecording(false);
    setShowAudioVisualizer(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Audio enabled" : "Audio muted",
      description: isMuted ? "You can now hear the assistant" : "The assistant's voice is now muted",
    });
  };
  
  return {
    isRecording,
    isMuted,
    showAudioVisualizer,
    audioLevel,
    startRecording,
    stopRecording,
    toggleMute
  };
};
