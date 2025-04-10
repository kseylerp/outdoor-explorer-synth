
import { AudioTranscriptHandler, ErrorHandler, AIResponseHandler, TripDataHandler } from './types';

export class MessageHandler {
  constructor(
    private onTranscriptReceived: AudioTranscriptHandler | null = null,
    private onError: ErrorHandler | null = null,
    private onAIResponseStart: AIResponseHandler | null = null,
    private onAIResponseEnd: AIResponseHandler | null = null,
    private onTripDataReceived: TripDataHandler | null = null
  ) {}
  
  handleMessage(message: any): void {
    // Log incoming messages for debugging
    console.log('Received message:', message);
    
    switch (message.type) {
      case 'response.audio_transcript.delta':
        // Incremental transcript update
        if (this.onTranscriptReceived && message.delta) {
          this.onTranscriptReceived(message.delta);
        }
        break;
        
      case 'response.audio_transcript.done':
        // Full transcript is now available
        if (this.onTranscriptReceived && message.transcript) {
          this.onTranscriptReceived(message.transcript);
          
          // Extract JSON if it exists in the response
          this.extractTripData(message.transcript);
        }
        break;
        
      case 'error':
        console.error('Error from OpenAI:', message);
        if (this.onError) {
          this.onError(new Error(message.message || 'Unknown error from OpenAI'));
        }
        break;
        
      case 'session.created':
        console.log('Session created confirmation received');
        break;
        
      case 'response.audio.done':
        // Audio response is complete
        if (this.onAIResponseEnd) {
          this.onAIResponseEnd();
        }
        break;
        
      case 'response.done':
        // Response is completely finished
        break;
    }
  }
  
  private extractTripData(transcript: string): void {
    try {
      const jsonMatch = transcript.match(/```json(.*?)```/s);
      if (jsonMatch && jsonMatch[1] && this.onTripDataReceived) {
        const jsonData = JSON.parse(jsonMatch[1].trim());
        this.onTripDataReceived(jsonData);
      }
    } catch (err) {
      console.error('Failed to parse JSON from transcript:', err);
    }
  }
}
