
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { RealtimeAudioService } from './RealtimeAudioService';
import { ChatState } from './ChatControls';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatState = () => {
  const [state, setState] = useState<ChatState>('idle');
  const [message, setMessage] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAudioVisualizer, setShowAudioVisualizer] = useState(false);
  
  const realtimeServiceRef = useRef<RealtimeAudioService | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeServiceRef.current) {
        realtimeServiceRef.current.disconnect();
      }
    };
  }, []);

  const startSession = async () => {
    try {
      setState('connecting');
      setErrorMessage(null);
      
      const service = new RealtimeAudioService();
      realtimeServiceRef.current = service;
      
      // Set up event handlers
      service.onTranscriptReceived = (text) => {
        setTranscript(text);
        
        // When full transcript is received
        if (text && text.trim()) {
          setHistory(prev => [...prev, { role: 'user', content: text }]);
          setState('processing');
          
          // Simulate assistant's response
          setTimeout(() => {
            const responses = [
              "I'd recommend exploring the hidden trails in Yosemite Valley. The Mirror Lake loop is less traveled but offers stunning views.",
              "For a weekend trip to Yosemite, check out the Pohono Trail. It's a moderate difficulty hike with fewer crowds and amazing viewpoints.",
              "Instead of the main Yosemite trails, try the Chilnualna Falls trail in Wawona. It's challenging but rewards you with a series of cascading waterfalls and minimal crowds."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setHistory(prev => [...prev, { role: 'assistant', content: randomResponse }]);
            setState('connected');
          }, 2000);
        }
      };
      
      service.onError = (error) => {
        console.error('Realtime service error:', error);
        setErrorMessage(error.message);
        setState('error');
        toast({
          title: "Connection error",
          description: error.message,
          variant: "destructive"
        });
      };
      
      await service.initSession();
      
      toast({
        title: "Adventure assistant ready",
        description: "Your AI adventure guide is ready to help you plan your next trip",
      });
      
      setState('connected');
    } catch (error) {
      console.error('Failed to start session:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      setState('error');
      toast({
        title: "Connection error",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || state === 'processing') {
      return;
    }
    
    try {
      setState('processing');
      setHistory(prev => [...prev, { role: 'user', content: message }]);
      
      // Simulate assistant's response
      setTimeout(() => {
        const responses = [
          "I'd recommend exploring the hidden trails in Yosemite Valley. The Mirror Lake loop is less traveled but offers stunning views.",
          "For a weekend trip to Yosemite, check out the Pohono Trail. It's a moderate difficulty hike with fewer crowds and amazing viewpoints.",
          "Instead of the main Yosemite trails, try the Chilnualna Falls trail in Wawona. It's challenging but rewards you with a series of cascading waterfalls and minimal crowds."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setHistory(prev => [...prev, { role: 'assistant', content: randomResponse }]);
        setState('connected');
      }, 2000);
      
      setMessage('');
      setTranscript('');
    } catch (error) {
      console.error('Error sending message:', error);
      setState('error');
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setShowAudioVisualizer(true);
    setState('recording');
    
    // Check for microphone permissions and initialize session
    if (!realtimeServiceRef.current) {
      startSession();
    } else {
      toast({
        title: "Microphone active",
        description: "Speak now. The assistant will respond when you pause.",
      });
    }
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setShowAudioVisualizer(false);
    setState('connected');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Audio enabled" : "Audio muted",
      description: isMuted ? "You can now hear the assistant" : "The assistant's voice is now muted",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    state,
    message,
    transcript,
    isRecording,
    isMuted,
    history,
    errorMessage,
    showAudioVisualizer,
    setMessage,
    startSession,
    handleSendMessage,
    startRecording,
    stopRecording,
    toggleMute,
    handleKeyDown
  };
};
