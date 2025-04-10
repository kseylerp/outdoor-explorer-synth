
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, SendHorizonal, Volume2, VolumeX, AudioWaveform } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RealtimeAudioService } from './realtime/RealtimeAudioService';

type RealtimeChatState = 'idle' | 'connecting' | 'connected' | 'recording' | 'processing' | 'error';

const RealtimeChat: React.FC = () => {
  const [state, setState] = useState<RealtimeChatState>('idle');
  const [message, setMessage] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAudioVisualizer, setShowAudioVisualizer] = useState(false);
  
  const realtimeServiceRef = useRef<RealtimeAudioService | null>(null);
  const { toast } = useToast();
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeServiceRef.current) {
        realtimeServiceRef.current.disconnect();
      }
    };
  }, []);

  // Initialize the RealtimeAudioService
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
      setErrorMessage(`Failed to start session: ${error.message}`);
      setState('error');
      toast({
        title: "Connection error",
        description: error.message,
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
        description: error.message,
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
  
  const renderControls = () => {
    switch (state) {
      case 'idle':
        return (
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={startSession} 
              className="flex items-center gap-2 text-lg px-6 py-2 h-12"
            >
              <AudioWaveform className="h-5 w-5" />
              Start Voice Adventure
            </Button>
            <p className="text-sm text-muted-foreground">
              Speak with our AI adventure guide to plan your next trip
            </p>
          </div>
        );
      case 'connecting':
        return (
          <Button disabled className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to assistant...
          </Button>
        );
      case 'connected':
      case 'recording':
      case 'processing':
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? "bg-red-100" : ""}
              disabled={state === 'processing'}
            >
              {isRecording ? <MicOff /> : <Mic />}
            </Button>
            <Textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-9 flex-1"
              disabled={state === 'processing' || isRecording}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || state === 'processing' || isRecording}
            >
              <SendHorizonal />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="space-y-2">
            <p className="text-sm text-red-500">{errorMessage}</p>
            <Button onClick={startSession}>Retry Connection</Button>
          </div>
        );
      default:
        return null;
    }
  };

  // Audio visualizer overlay
  const renderAudioVisualizer = () => {
    if (!showAudioVisualizer) return null;
    
    const barCount = 20;
    const bars = Array(barCount).fill(0).map((_, i) => ({
      height: Math.random() * 40 + 10,
      animationDuration: Math.random() * 1 + 0.5
    }));
    
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <button 
          onClick={stopRecording}
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
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Offbeat Adventure Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-auto p-2">
          {history.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>👋 Hi there! I'm your adventure guide.</p>
              <p>Ask me about outdoor adventures, hiking trails, national parks, or unique travel experiences!</p>
            </div>
          )}

          {history.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                  {transcript}
                  <div className="animate-pulse">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {state === 'processing' && (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">The assistant is thinking...</p>
          </div>
        )}
        
        {renderControls()}
        {renderAudioVisualizer()}
      </CardContent>
    </Card>
  );
};

export default RealtimeChat;
