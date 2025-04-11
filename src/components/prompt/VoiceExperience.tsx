
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceExperienceProps {
  onClose: () => void;
  onTranscript: (text: string) => void;
}

const VoiceExperience: React.FC<VoiceExperienceProps> = ({ onClose, onTranscript }) => {
  const [isListening, setIsListening] = useState(true);
  const [audioVisualizer, setAudioVisualizer] = useState<number[]>(Array(20).fill(10));
  const [processingComplete, setProcessingComplete] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [voice, setVoice] = useState<string>("sage"); // Default to sage voice
  const { toast } = useToast();

  // Create animated audio visualization
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioVisualizer(Array(20).fill(0).map(() => Math.random() * 40 + 10));
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isListening]);
  
  // Connect to the OpenAI Realtime API and start listening
  useEffect(() => {
    if (isListening) {
      // Initialize WebRTC connection to OpenAI Realtime API
      import('@/components/realtime/RealtimeAudioService').then(({ RealtimeAudioService }) => {
        const service = new RealtimeAudioService();
        
        service.initSession()
          .then((sessionId) => {
            console.log('Realtime session started with ID:', sessionId);
            
            // When we connect, check the voice being used
            toast({
              title: "Connected with Sage voice",
              description: "You're now connected using OpenAI's Sage voice assistant",
            });
            
            service.onTranscriptReceived = (transcript) => {
              if (transcript && transcript.trim()) {
                onTranscript(transcript);
                
                // When we get the transcript, don't close yet, wait for AI response
                setAiResponseText("I'm finding the perfect adventure options based on your request...");
                setIsListening(false);
                setProcessingComplete(false);
                
                // Simulate AI response after a delay
                setTimeout(() => {
                  setAiResponseText("I understand you're looking for a weekend trip with hiking. Let me find some great offbeat options for you!");
                  
                  // After AI responds verbally, prepare to generate the trip with the transcript
                  setTimeout(() => {
                    setProcessingComplete(true);
                    // User can now close the experience or keep listening to AI
                  }, 2000);
                }, 1500);
              }
            };
            
            service.onError = (error) => {
              console.error('Realtime audio error:', error);
              toast({
                title: "Error with voice service",
                description: error.message,
                variant: "destructive"
              });
            };
          })
          .catch(error => {
            console.error('Failed to initialize realtime session:', error);
            toast({
              title: "Connection failed",
              description: "Could not connect to the voice service. Please try again.",
              variant: "destructive"
            });
          });
          
        return () => {
          service.disconnect();
        };
      });
    }
  }, [isListening, onTranscript, toast]);

  // Handle manual close with confirmation if needed
  const handleClose = () => {
    if (!processingComplete && !isListening) {
      // If we received a transcript but processing isn't complete,
      // we should still submit to generate the trip
      onClose();
    } else {
      // Otherwise just close normally
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="text-white text-xl font-medium mb-2">
        {isListening ? 'Speak now...' : aiResponseText || 'Processing...'}
      </div>

      <div className="text-white/70 text-sm mb-6">
        Using OpenAI with Sage voice
      </div>
      
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
      
      <div className="text-white/70 text-sm max-w-md text-center px-4">
        {isListening 
          ? "What adventure are you looking for? Describe your ideal trip!" 
          : processingComplete 
            ? "Ready to explore your adventure options? Click outside to view them."
            : "I'm processing your request..."}
      </div>
      
      {processingComplete && (
        <button 
          onClick={onClose}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
        >
          Show My Adventure Options
        </button>
      )}
    </div>
  );
};

export default VoiceExperience;
