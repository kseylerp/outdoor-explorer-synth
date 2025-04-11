
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatMessages = () => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);
  
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || isProcessing) {
      return;
    }
    
    try {
      setIsProcessing(true);
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
        setIsProcessing(false);
      }, 2000);
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessing(false);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    }
  }, [message, isProcessing]);

  const addUserMessage = useCallback((content: string) => {
    setHistory(prev => [...prev, { role: 'user', content }]);
  }, []);

  const addAssistantMessage = useCallback((content: string) => {
    setHistory(prev => [...prev, { role: 'assistant', content }]);
  }, []);
  
  const processTranscript = useCallback((transcript: string) => {
    if (transcript && transcript.trim()) {
      setPendingTranscript(transcript);
      addUserMessage(transcript);
      setIsProcessing(true);
      
      // Simulate assistant's response
      setTimeout(() => {
        const responses = [
          "I'd recommend exploring the hidden trails in Yosemite Valley. The Mirror Lake loop is less traveled but offers stunning views.",
          "For a weekend trip to Yosemite, check out the Pohono Trail. It's a moderate difficulty hike with fewer crowds and amazing viewpoints.",
          "Instead of the main Yosemite trails, try the Chilnualna Falls trail in Wawona. It's challenging but rewards you with a series of cascading waterfalls and minimal crowds."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addAssistantMessage(randomResponse);
        setIsProcessing(false);
        setPendingTranscript(null);
      }, 2000);
    }
  }, [addUserMessage, addAssistantMessage]);
  
  return {
    history,
    message,
    isProcessing,
    pendingTranscript,
    setMessage,
    handleSendMessage,
    setIsProcessing,
    addUserMessage,
    addAssistantMessage,
    processTranscript
  };
};
