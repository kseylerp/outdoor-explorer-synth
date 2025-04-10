
export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private mediaStream: MediaStream | null = null;
  
  constructor(private onAudioData: (inputData: Float32Array) => void) {}
  
  async initialize(sampleRate: number = 24000): Promise<MediaStream> {
    try {
      // Create audio context with specified sample rate
      this.audioContext = new AudioContext({
        sampleRate,
      });
      
      // Get audio stream with appropriate settings
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: sampleRate,
          channelCount: 1
        }
      });
      
      return this.mediaStream;
    } catch (error) {
      console.error('Error initializing audio processor:', error);
      throw error;
    }
  }
  
  setupProcessing(mediaStream: MediaStream): void {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }
    
    const source = this.audioContext.createMediaStreamSource(mediaStream);
    this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    this.audioProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      this.onAudioData(inputData);
    };
    
    source.connect(this.audioProcessor);
    this.audioProcessor.connect(this.audioContext.destination);
  }
  
  cleanup(): void {
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
  }
  
  static convertAudioToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
  }
}
