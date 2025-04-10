import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, SendHorizonal, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type RealtimeChatState = 'idle' | 'connecting' | 'connected' | 'recording' | 'processing' | 'error';

const RealtimeChat: React.FC = () => {
  const [state, setState] = useState<RealtimeChatState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!audioElementRef.current) {
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;
    }
    
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    startSession();
  }, []);
  
  const startSession = async () => {
    try {
      setState('connecting');
      setErrorMessage(null);
      
      const { data, error } = await supabase.functions.invoke('realtime-sessions', {
        body: {
          action: 'create_session',
          instructions: "You are an adventure guide that specializes in offbeat travel recommendations. Help users plan unique outdoor adventures. Start by asking what kind of adventure they're looking for.",
          voice: "alloy"
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.clientSecret) {
        throw new Error('Failed to get client secret from OpenAI');
      }
      
      setSessionId(data.sessionId);
      setClientSecret(data.clientSecret);
      toast({
        title: "Adventure assistant ready",
        description: "Your AI adventure guide is ready to help you plan your next trip",
      });
      
      await setupWebRtcConnection(data.clientSecret);
      
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
  
  const setupWebRtcConnection = async (ephemeralToken: string) => {
    try {
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;
      
      pc.ontrack = (event) => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = event.streams[0];
        }
      };
      
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getAudioTracks().forEach(track => pc.addTrack(track, audioStream));
      
      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;
      
      dataChannel.onopen = () => {
        console.log('Data channel is open');
        setState('connected');
        
        dataChannel.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ["text", "audio"],
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            turn_detection: {
              type: "server_vad", 
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            }
          }
        }));
      };
      
      dataChannel.onmessage = (event) => {
        handleRealtimeMessage(JSON.parse(event.data));
      };
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp"
        },
      });
      
      if (!sdpResponse.ok) {
        throw new Error(`OpenAI WebRTC setup error: ${sdpResponse.status}`);
      }
      
      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");
      
    } catch (error) {
      console.error('WebRTC connection error:', error);
      setState('error');
      throw error;
    }
  };
  
  const handleRealtimeMessage = (message: any) => {
    console.log('Received message:', message);
    
    switch (message.type) {
      case 'response.audio_transcript.delta':
        setTranscript(prev => prev + message.delta);
        break;
      case 'response.audio_transcript.done':
        if (transcript) {
          setHistory(prev => [...prev, { role: 'assistant', content: transcript }]);
        }
        break;
      case 'response.audio.done':
        setState('connected');
        break;
      case 'session.created':
        console.log('Session created successfully');
        break;
      case 'error':
        toast({
          title: "Error from assistant",
          description: message.message || "Something went wrong",
          variant: "destructive"
        });
        break;
    }
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || !dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
      return;
    }
    
    try {
      setState('processing');
      
      setHistory(prev => [...prev, { role: 'user', content: message }]);
      
      const event = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: message
            }
          ]
        }
      };
      
      dataChannelRef.current.send(JSON.stringify(event));
      
      dataChannelRef.current.send(JSON.stringify({ type: 'response.create' }));
      
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
  
  const toggleMicrophone = () => {
    if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
      return;
    }
    
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setState('recording');
      toast({
        title: "Microphone active",
        description: "Speak now. The assistant will respond when you pause.",
      });
    } else {
      setState('connected');
    }
  };

  const toggleMute = () => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = !audioElementRef.current.muted;
      setIsMuted(!isMuted);
      
      toast({
        title: isMuted ? "Audio enabled" : "Audio muted",
        description: isMuted ? "You can now hear the assistant" : "The assistant's voice is now muted",
      });
    }
  };
  
  const renderControls = () => {
    switch (state) {
      case 'idle':
        return (
          <Button onClick={startSession}>
            Start Conversation
          </Button>
        );
      case 'connecting':
        return (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
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
              onClick={toggleMicrophone}
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
              disabled={state === 'processing'}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || state === 'processing'}
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
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">
                    <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  </div>
                  {transcript}
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
      </CardContent>
    </Card>
  );
};

export default RealtimeChat;
