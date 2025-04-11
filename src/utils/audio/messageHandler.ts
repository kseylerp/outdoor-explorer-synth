
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
        this.extractTripDataFromCompleteResponse(message);
        break;
    }
  }
  
  private extractTripData(transcript: string): void {
    try {
      // Look for JSON format in the transcript
      const jsonMatch = transcript.match(/```json(.*?)```/s);
      if (jsonMatch && jsonMatch[1] && this.onTripDataReceived) {
        try {
          const jsonData = JSON.parse(jsonMatch[1].trim());
          console.log("Extracted trip data from transcript:", jsonData);
          this.onTripDataReceived(jsonData);
          return;
        } catch (err) {
          console.error('Failed to parse JSON from transcript match:', err);
        }
      }
      
      // Alternative format without code blocks
      const curlyBraceMatch = transcript.match(/{[\s\S]*"destination"[\s\S]*}/);
      if (curlyBraceMatch && this.onTripDataReceived) {
        try {
          const jsonData = JSON.parse(curlyBraceMatch[0]);
          console.log("Extracted trip data from transcript (curly brace match):", jsonData);
          this.onTripDataReceived(jsonData);
          return;
        } catch (err) {
          console.error('Failed to parse JSON from curly brace match:', err);
        }
      }
      
      console.log('No valid JSON data found in transcript');
    } catch (err) {
      console.error('Error extracting trip data from transcript:', err);
    }
  }
  
  private extractTripDataFromCompleteResponse(message: any): void {
    if (!message.response || !this.onTripDataReceived) return;
    
    try {
      // Try to find any JSON in the complete response
      const items = message.response.items || [];
      
      for (const item of items) {
        if (item.content && Array.isArray(item.content)) {
          for (const content of item.content) {
            if (content.type === 'text' && content.text) {
              // Extract JSON from the text
              this.extractTripData(content.text);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error extracting trip data from complete response:', err);
    }
  }
}
