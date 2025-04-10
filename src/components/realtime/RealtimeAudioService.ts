
import { supabase } from '@/integrations/supabase/client';

export class RealtimeAudioService {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private sessionId: string | null = null;
  
  // Callback handlers
  public onTranscriptReceived: ((text: string) => void) | null = null;
  public onError: ((error: Error) => void) | null = null;
  
  constructor() {
    this.audioEl = document.createElement('audio');
    this.audioEl.autoplay = true;
  }

  async initSession(): Promise<string> {
    try {
      console.log('Initializing realtime session...');
      
      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      // Create RTCPeerConnection
      this.pc = new RTCPeerConnection();
      
      // Set up session with Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('realtime-sessions', {
        body: {
          action: 'create_session',
          instructions: "You are an adventure guide that specializes in offbeat travel recommendations. Help users plan unique outdoor adventures. When a user asks about a destination, suggest lesser-known attractions and experiences. Keep responses concise and focused on adventure activities.",
          voice: "alloy"
        }
      });
      
      if (error) {
        console.error('Error creating session:', error);
        throw new Error('Failed to create session: ' + error.message);
      }
      
      if (!data?.clientSecret) {
        throw new Error('Failed to get client secret from OpenAI');
      }
      
      this.sessionId = data.sessionId;
      console.log('Session created with ID:', this.sessionId);
      
      // Set up WebRTC connection
      await this.setupWebRtcConnection(data.clientSecret);
      await this.startAudioCapture();
      
      return this.sessionId;
    } catch (error) {
      console.error('Error initializing session:', error);
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }
  
  private async setupWebRtcConnection(ephemeralToken: string): Promise<void> {
    if (!this.pc) {
      throw new Error('PeerConnection not initialized');
    }
    
    try {
      // Set up audio track handling
      this.pc.ontrack = (event) => {
        if (this.audioEl) {
          this.audioEl.srcObject = event.streams[0];
        }
      };
      
      // Create data channel
      const dataChannel = this.pc.createDataChannel('oai-events');
      this.dc = dataChannel;
      
      // Set up data channel event handlers
      dataChannel.onopen = () => {
        console.log('Data channel open');
        this.sendSessionUpdate();
      };
      
      dataChannel.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };
      
      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      
      // Connect to OpenAI
      const response = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp"
        },
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI WebRTC setup error: ${response.status}`);
      }
      
      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await response.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log('WebRTC connection established');
    } catch (error) {
      console.error('WebRTC connection failed:', error);
      throw error;
    }
  }
  
  private sendSessionUpdate(): void {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('Cannot send session update: data channel not open');
      return;
    }
    
    try {
      this.dc.send(JSON.stringify({
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
      
      console.log('Session update sent');
    } catch (error) {
      console.error('Error sending session update:', error);
    }
  }
  
  private handleMessage(message: any): void {
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
      case 'response.done':
        // Audio response is complete
        break;
    }
  }
  
  private async startAudioCapture(): Promise<void> {
    try {
      // Get audio stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000,
          channelCount: 1
        }
      });
      
      // Add tracks to peer connection
      if (this.pc) {
        this.mediaStream.getAudioTracks().forEach(track => {
          if (this.pc && this.mediaStream) {
            this.pc.addTrack(track, this.mediaStream);
          }
        });
      }
      
      // Set up audio processing
      if (this.audioContext) {
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
        
        this.audioProcessor.onaudioprocess = (e) => {
          if (this.dc && this.dc.readyState === 'open') {
            const inputData = e.inputBuffer.getChannelData(0);
            this.sendAudioData(inputData);
          }
        };
        
        source.connect(this.audioProcessor);
        this.audioProcessor.connect(this.audioContext.destination);
      }
    } catch (error) {
      console.error('Error starting audio capture:', error);
      throw error;
    }
  }
  
  private sendAudioData(float32Array: Float32Array): void {
    if (!this.dc || this.dc.readyState !== 'open') {
      return;
    }
    
    try {
      // Convert Float32Array to Int16Array (PCM format)
      const int16Array = new Int16Array(float32Array.length);
      for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      
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
      this.dc.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64
      }));
    } catch (error) {
      console.error('Error sending audio data:', error);
    }
  }
  
  disconnect(): void {
    try {
      // Stop audio processor
      if (this.audioProcessor) {
        this.audioProcessor.disconnect();
        this.audioProcessor = null;
      }
      
      // Stop media tracks
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }
      
      // Close audio context
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
        this.audioContext = null;
      }
      
      // Close data channel
      if (this.dc) {
        this.dc.close();
        this.dc = null;
      }
      
      // Close peer connection
      if (this.pc) {
        this.pc.close();
        this.pc = null;
      }
      
      console.log('RealtimeAudioService disconnected');
    } catch (error) {
      console.error('Error disconnecting RealtimeAudioService:', error);
    }
  }
}
