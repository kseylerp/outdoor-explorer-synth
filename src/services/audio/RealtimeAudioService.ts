
import { supabase } from '@/integrations/supabase/client';
import { RealtimeAudioOptions } from '@/utils/audio/types';
import { AudioProcessor } from '@/utils/audio/audioProcessor';
import { WebRTCHandler } from '@/utils/audio/webRTCHandler';
import { MessageHandler } from '@/utils/audio/messageHandler';
import { SessionManager } from '@/utils/audio/sessionManager';

export class RealtimeAudioService {
  private webRTCHandler: WebRTCHandler | null = null;
  private audioProcessor: AudioProcessor | null = null;
  private messageHandler: MessageHandler | null = null;
  private sessionManager: SessionManager;
  private sessionId: string | null = null;
  private transcript: string = '';
  
  // Callback handlers
  public onTranscriptReceived: ((text: string) => void) | null = null;
  public onError: ((error: Error) => void) | null = null;
  public onAIResponseStart: (() => void) | null = null;
  public onAIResponseEnd: (() => void) | null = null;
  public onTripDataReceived: ((tripData: any) => void) | null = null;
  
  constructor(options: RealtimeAudioOptions = {}) {
    // Initialize callback handlers from options
    this.onTranscriptReceived = options.onTranscriptReceived || null;
    this.onError = options.onError || null;
    this.onAIResponseStart = options.onAIResponseStart || null;
    this.onAIResponseEnd = options.onAIResponseEnd || null;
    this.onTripDataReceived = options.onTripDataReceived || null;
    
    this.sessionManager = new SessionManager();
  }

  async initSession(voice: string = "sage"): Promise<string> {
    try {
      console.log('Initializing realtime session with voice:', voice);
      
      // Create message handler that will save transcript for later use
      this.messageHandler = new MessageHandler(
        (text: string) => {
          this.transcript = text;
          console.log('Transcript updated:', text);
          if (this.onTranscriptReceived) this.onTranscriptReceived(text);
        },
        (error: Error) => {
          console.error('Error in MessageHandler:', error);
          if (this.onError) this.onError(error);
        },
        () => {
          console.log('AI response started');
          if (this.onAIResponseStart) this.onAIResponseStart();
        },
        () => {
          console.log('AI response ended');
          if (this.onAIResponseEnd) this.onAIResponseEnd();
        },
        (tripData: any) => {
          console.log('Trip data received:', tripData);
          if (this.onTripDataReceived) this.onTripDataReceived(tripData);
        }
      );
      
      // Create WebRTC handler
      this.webRTCHandler = new WebRTCHandler(
        (event) => { 
          console.log('WebRTC track event received');
          if (this.onAIResponseStart) this.onAIResponseStart();
        },
        (message) => {
          console.log('WebRTC message received');
          if (this.messageHandler) this.messageHandler.handleMessage(message);
        },
        () => {
          console.log('WebRTC data channel opened, sending session update');
          this.sendSessionUpdate();
        }
      );
      
      // Create audio processor
      this.audioProcessor = new AudioProcessor((audioData) => this.sendAudioData(audioData));
      
      // Create session with OpenAI via Supabase Edge Function
      console.log('Requesting session from Supabase Edge Function...');
      const { sessionId, clientSecret } = await this.sessionManager.createSession(undefined, voice);
      this.sessionId = sessionId;
      console.log('Got session ID:', sessionId);
      
      // Set up WebRTC connection
      console.log('Setting up WebRTC connection...');
      await this.setupWebRtcConnection(clientSecret);
      console.log('WebRTC connection established successfully');
      
      await this.startAudioCapture();
      console.log('Audio capture started successfully');
      
      return this.sessionId;
    } catch (error) {
      console.error('Error initializing session:', error);
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }
  
  // Method to get the current transcript
  async getTranscript(): Promise<string> {
    return this.transcript;
  }
  
  private async setupWebRtcConnection(ephemeralToken: string): Promise<void> {
    if (!this.webRTCHandler) {
      throw new Error('WebRTC handler not initialized');
    }
    
    try {
      // Initialize WebRTC connection
      const pc = await this.webRTCHandler.initialize();
      console.log('WebRTC peer connection initialized:', pc !== null);
      
      // Create data channel
      const dc = this.webRTCHandler.createDataChannel();
      console.log('Data channel created:', dc !== null);
      
      // Create and set local description
      const offer = await this.webRTCHandler.createOffer();
      console.log('Local description (offer) created');
      
      // Connect to OpenAI
      console.log('Sending SDP to OpenAI');
      const sdpAnswer = await this.sessionManager.connectToOpenAI(offer.sdp!, ephemeralToken);
      console.log('Received SDP answer from OpenAI');
      
      const answer = {
        type: "answer" as RTCSdpType,
        sdp: sdpAnswer,
      };
      
      await this.webRTCHandler.setRemoteDescription(answer);
      console.log('Remote description (answer) set - WebRTC connection established');
    } catch (error) {
      console.error('WebRTC connection failed:', error);
      throw error;
    }
  }
  
  private sendSessionUpdate(): void {
    if (!this.webRTCHandler) {
      console.warn('Cannot send session update: WebRTC handler not initialized');
      return;
    }
    
    try {
      console.log('Sending session update message');
      this.webRTCHandler.sendMessage({
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
      });
      
      console.log('Session update sent');
    } catch (error) {
      console.error('Error sending session update:', error);
    }
  }
  
  private async startAudioCapture(): Promise<void> {
    if (!this.audioProcessor || !this.webRTCHandler) {
      throw new Error('Audio processor or WebRTC handler not initialized');
    }
    
    try {
      // Initialize audio processor and get audio stream
      console.log('Initializing audio processor');
      const mediaStream = await this.audioProcessor.initialize();
      console.log('Audio processor initialized, got media stream:', mediaStream !== null);
      
      // Add tracks to peer connection
      if (mediaStream) {
        mediaStream.getAudioTracks().forEach(track => {
          console.log('Adding audio track to peer connection');
          if (this.webRTCHandler) {
            this.webRTCHandler.addTrack(track, mediaStream);
          }
        });
      }
      
      // Set up audio processing pipeline
      console.log('Setting up audio processing pipeline');
      this.audioProcessor.setupProcessing(mediaStream);
      console.log('Audio processing pipeline setup complete');
    } catch (error) {
      console.error('Error starting audio capture:', error);
      throw error;
    }
  }
  
  private sendAudioData(float32Array: Float32Array): void {
    if (!this.webRTCHandler) {
      return;
    }
    
    try {
      // Convert Float32Array to Int16Array (PCM format)
      const int16Array = AudioProcessor.convertAudioToInt16(float32Array);
      
      // Convert to base64
      const uint8Array = new Uint8Array(int16Array.buffer);
      let binary = '';
      const chunkSize = 0x8000;
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      const base64 = btoa(binary);
      
      // Send audio data
      this.webRTCHandler.sendMessage({
        type: 'input_audio_buffer.append',
        audio: base64
      });
    } catch (error) {
      console.error('Error sending audio data:', error);
    }
  }
  
  disconnect(): void {
    try {
      console.log('Disconnecting RealtimeAudioService');
      // Clean up audio processor
      if (this.audioProcessor) {
        console.log('Cleaning up audio processor');
        this.audioProcessor.cleanup();
        this.audioProcessor = null;
      }
      
      // Close WebRTC connection
      if (this.webRTCHandler) {
        console.log('Closing WebRTC connection');
        this.webRTCHandler.close();
        this.webRTCHandler = null;
      }
      
      this.messageHandler = null;
      
      console.log('RealtimeAudioService disconnected');
    } catch (error) {
      console.error('Error disconnecting RealtimeAudioService:', error);
    }
  }
}
