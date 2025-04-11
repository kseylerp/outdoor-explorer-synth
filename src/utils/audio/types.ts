
export interface AudioTranscriptHandler {
  (text: string): void;
}

export interface ErrorHandler {
  (error: Error): void;
}

export interface AIResponseHandler {
  (): void;
}

export interface TripDataHandler {
  (tripData: any): void;
}

export interface RealtimeAudioOptions {
  onTranscriptReceived?: AudioTranscriptHandler;
  onError?: ErrorHandler;
  onAIResponseStart?: AIResponseHandler;
  onAIResponseEnd?: AIResponseHandler;
  onTripDataReceived?: TripDataHandler;
}

export interface SessionResponse {
  sessionId: string;
  clientSecret: string;
}
