
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, MicOff, X } from 'lucide-react';
import { RealtimeAudioService } from '@/components/realtime/RealtimeAudioService';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onCancel: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onCancel }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [audioService, setAudioService] = useState<RealtimeAudioService | null>(null);
  const [visualizerValues, setVisualizerValues] = useState<number[]>(
    Array(20).fill(0).map(() => Math.random() * 30 + 10)
  );
  
  // Initialize audio service
  useEffect(() => {
    const service = new RealtimeAudioService();
    
    service.onTranscriptReceived = (text) => {
      setTranscript(text);
      if (text && text.trim()) {
        setIsRecording(false);
        setIsProcessing(true);
        
        // Simulate processing delay
        setTimeout(() => {
          onTranscript(text);
        }, 1000);
      }
    };
    
    service.onError = (error) => {
      console.error('Voice recording error:', error);
      setIsRecording(false);
      onCancel();
    };
    
    // Start the session
    service.initSession()
      .then(() => {
        setAudioService(service);
      })
      .catch((err) => {
        console.error('Failed to initialize audio service:', err);
        onCancel();
      });
    
    return () => {
      service.disconnect();
    };
  }, [onTranscript, onCancel]);
  
  // Animate visualizer
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setVisualizerValues(
          Array(20).fill(0).map(() => Math.random() * 30 + 10)
        );
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRecording]);
  
  const handleStopRecording = () => {
    setIsRecording(false);
    if (audioService) {
      audioService.disconnect();
    }
    
    // If we have transcript, let the parent component know
    if (transcript && transcript.trim()) {
      setIsProcessing(true);
      setTimeout(() => {
        onTranscript(transcript);
      }, 500);
    } else {
      onCancel();
    }
  };
  
  return (
    <div className="w-full flex flex-col items-center space-y-4 py-4">
      <div className="relative">
        <div className="flex items-center justify-center gap-1 h-20">
          {visualizerValues.map((height, i) => (
            <div 
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                isRecording 
                  ? 'bg-gradient-to-t from-purple-600 to-purple-400' 
                  : 'bg-gradient-to-t from-gray-600 to-gray-400'
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
        
        {transcript && (
          <div className="text-center mt-2 font-medium">
            "{transcript}"
          </div>
        )}
        
        <div className="flex justify-center mt-4 space-x-2">
          {isProcessing ? (
            <Button disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={onCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <Button 
                variant={isRecording ? "destructive" : "secondary"}
                onClick={handleStopRecording}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record Again
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
