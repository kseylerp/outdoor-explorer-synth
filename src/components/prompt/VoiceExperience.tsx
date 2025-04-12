
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceExperienceProps {
  onClose: () => void;
  onTranscript: (text: string, tripData?: any) => void;
}

const VoiceExperience: React.FC<VoiceExperienceProps> = ({ onClose, onTranscript }) => {
  const [isListening, setIsListening] = useState(true);
  const [audioVisualizer, setAudioVisualizer] = useState<number[]>(Array(20).fill(10));
  const [processingComplete, setProcessingComplete] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [voice] = useState<string>("sage"); // Always use sage voice
  const [quickResponses, setQuickResponses] = useState<{text: string, value: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      console.log('Initializing voice experience and connecting to Realtime API');
      // Initialize WebRTC connection to OpenAI Realtime API
      import('@/services/audio/RealtimeAudioService').then(({ RealtimeAudioService }) => {
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
                console.log("Received transcript:", transcript);
                
                // When we get the transcript, don't close yet, wait for AI response
                setAiResponseText("I'm finding the perfect adventure options based on your request...");
                setIsListening(false);
                setProcessingComplete(false);
                
                // Pass transcript to parent
                onTranscript(transcript);
                
                // Extract potential quick response options from transcript
                extractQuickResponses(transcript);
                
                // Simulate AI response after a delay
                setTimeout(() => {
                  setAiResponseText("I understand your adventure request. Let me find some great offbeat options for you!");
                  
                  // After AI responds verbally, prepare to generate the trip with the transcript
                  setTimeout(() => {
                    setProcessingComplete(true);
                    // User can now close the experience or keep listening to AI
                  }, 2000);
                }, 1500);
              }
            };
            
            service.onTripDataReceived = (tripData) => {
              console.log('Trip data received in VoiceExperience:', tripData);
              if (tripData) {
                // Pass both transcript and trip data to parent
                service.getTranscript().then(transcript => {
                  if (transcript) {
                    onTranscript(transcript, tripData);
                  }
                });
              }
            };
            
            service.onError = (error) => {
              console.error('Realtime audio error:', error);
              setError(error.message);
              toast({
                title: "Error with voice service",
                description: error.message,
                variant: "destructive"
              });
            };
          })
          .catch(error => {
            console.error('Failed to initialize realtime session:', error);
            setError(`Connection failed: ${error.message}`);
            
            toast({
              title: "Connection failed",
              description: "Could not connect to the voice service. Please try again.",
              variant: "destructive"
            });
            
            // Auto-close after error
            setTimeout(() => {
              onClose();
            }, 3000);
          });
          
        return () => {
          console.log('Disconnecting voice service');
          service.disconnect();
        };
      }).catch(err => {
        console.error('Error importing RealtimeAudioService:', err);
        setError(`Failed to load audio service: ${err.message}`);
      });
    }
  }, [isListening, onTranscript, toast, onClose]);

  // Extract yes/no or other binary options from AI responses
  const extractQuickResponses = (text: string) => {
    // Look for yes/no questions
    if (/would you like|do you want|are you interested|should I|yes or no/i.test(text)) {
      setQuickResponses([
        { text: "Yes", value: "Yes, please do!" },
        { text: "No", value: "No, thanks." }
      ]);
      return;
    }
    
    // Look for skill level questions
    if (/skill level|how experienced|difficulty|challenging/i.test(text)) {
      setQuickResponses([
        { text: "Beginner", value: "I'm a beginner." },
        { text: "Intermediate", value: "I have intermediate experience." },
        { text: "Advanced", value: "I'm an advanced adventurer." }
      ]);
      return;
    }
    
    // Look for time of year questions
    if (/time of year|when.*visit|season|month|spring|summer|fall|winter/i.test(text)) {
      setQuickResponses([
        { text: "Spring", value: "I'm planning to go in the spring." },
        { text: "Summer", value: "I'm planning to go in the summer." },
        { text: "Fall", value: "I'm planning to go in the fall." },
        { text: "Winter", value: "I'm planning to go in the winter." }
      ]);
      return;
    }
    
    // Default: clear any previous responses if no patterns match
    setQuickResponses([]);
  };

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

  // Handle quick response button click
  const handleQuickResponse = (responseValue: string) => {
    // Pass the response as transcript
    onTranscript(responseValue);
    onClose();
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
      
      {error ? (
        <div className="text-red-400 p-4 bg-red-900/20 rounded-md mb-6 max-w-md text-center">
          {error}
          <div className="mt-2">
            <Button onClick={onClose} variant="destructive" size="sm">Close</Button>
          </div>
        </div>
      ) : (
        <>
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
          
          {quickResponses.length > 0 && !isListening && (
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {quickResponses.map((response, index) => (
                <Button 
                  key={index}
                  onClick={() => handleQuickResponse(response.value)}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  {response.text}
                </Button>
              ))}
            </div>
          )}
          
          {processingComplete && (
            <Button 
              onClick={onClose}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
            >
              Show My Adventure Options
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default VoiceExperience;
