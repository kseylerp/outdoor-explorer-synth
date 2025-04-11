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
    console.log('Received message:', JSON.stringify(message, null, 2));
    
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
      console.log('Attempting to extract trip data from transcript:', transcript);
      
      // Look for JSON format in the transcript using various patterns
      const patterns = [
        // Standard JSON code block pattern
        /```json([\s\S]*?)```/,
        // Curly braces pattern for JSON without code blocks
        /\{[\s\S]*?"trip"[\s\S]*?\}/,
        // Alternate curly brace match with "destination"
        /\{[\s\S]*?"destination"[\s\S]*?\}/,
        // Alternate pattern for trip array
        /"trip"\s*:\s*\[([\s\S]*?)\]/
      ];
      
      for (const pattern of patterns) {
        const match = transcript.match(pattern);
        if (match && match[0]) {
          try {
            let jsonText = match[0];
            
            // If it's a code block match, we need the capture group
            if (pattern.toString().includes('```json')) {
              jsonText = match[1];
            }
            
            // Clean up the JSON text
            jsonText = jsonText.trim();
            
            console.log('Potential JSON match found:', jsonText);
            
            // Parse the JSON
            const jsonData = JSON.parse(jsonText);
            console.log("Successfully parsed JSON data:", jsonData);
            
            // If jsonData has a 'trip' property, use it directly
            if (jsonData.trip) {
              console.log("Found trip data in JSON:", jsonData.trip);
              this.onTripDataReceived?.(jsonData);
              return;
            }
            
            // Otherwise use the object itself (it might be a single trip)
            if (jsonData.destination || jsonData.location || jsonData.title) {
              console.log("Found single trip data:", jsonData);
              // Wrap single trip in a trip array structure
              this.onTripDataReceived?.({ trip: [jsonData] });
              return;
            }
            
            // If we got here, we found JSON but it doesn't match our expected structure
            console.log('JSON found but structure does not match expected trip format');
          } catch (parseErr) {
            console.error('Failed to parse JSON match:', parseErr);
          }
        }
      }
      
      console.log('No valid JSON data found in transcript using standard patterns');
      
      // Last resort: try to find anything that looks like JSON
      const jsonCandidate = this.findPotentialJson(transcript);
      if (jsonCandidate) {
        try {
          const jsonData = JSON.parse(jsonCandidate);
          console.log("Extracted trip data from candidate JSON:", jsonData);
          if (jsonData.trip || jsonData.destination || jsonData.location) {
            this.onTripDataReceived?.(jsonData.trip ? jsonData : { trip: [jsonData] });
            return;
          }
        } catch (err) {
          console.error('Failed to parse candidate JSON:', err);
        }
      }
      
      console.log('No valid JSON data found in transcript after all attempts');
    } catch (err) {
      console.error('Error extracting trip data from transcript:', err);
    }
  }
  
  private findPotentialJson(text: string): string | null {
    try {
      // Find the first opening brace
      const start = text.indexOf('{');
      if (start === -1) return null;
      
      // Find balanced closing brace
      let openBraces = 0;
      let end = -1;
      
      for (let i = start; i < text.length; i++) {
        if (text[i] === '{') openBraces++;
        else if (text[i] === '}') {
          openBraces--;
          if (openBraces === 0) {
            end = i + 1;
            break;
          }
        }
      }
      
      if (end === -1) return null;
      
      return text.substring(start, end);
    } catch (err) {
      console.error('Error finding potential JSON:', err);
      return null;
    }
  }
  
  private extractTripDataFromCompleteResponse(message: any): void {
    if (!message.response || !this.onTripDataReceived) return;
    
    try {
      console.log('Attempting to extract trip data from complete response');
      
      // Try to find any JSON in the complete response
      const items = message.response.items || [];
      let fullText = '';
      
      for (const item of items) {
        if (item.content && Array.isArray(item.content)) {
          for (const content of item.content) {
            if (content.type === 'text' && content.text) {
              // Append all text to build full response
              fullText += content.text + ' ';
            }
          }
        }
      }
      
      if (fullText) {
        console.log('Extracting trip data from full response text');
        this.extractTripData(fullText);
      }
    } catch (err) {
      console.error('Error extracting trip data from complete response:', err);
    }
  }
}
