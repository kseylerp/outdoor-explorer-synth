
export class WebRTCHandler {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  
  constructor(
    private onTrack: (event: RTCTrackEvent) => void,
    private onMessage: (message: any) => void,
    private onDataChannelOpen: () => void
  ) {
    this.audioEl = document.createElement('audio');
    this.audioEl.autoplay = true;
  }
  
  async initialize(): Promise<RTCPeerConnection> {
    this.pc = new RTCPeerConnection();
    
    // Set up audio track handling
    this.pc.ontrack = (event) => {
      this.audioEl.srcObject = event.streams[0];
      this.onTrack(event);
    };
    
    return this.pc;
  }
  
  createDataChannel(): RTCDataChannel {
    if (!this.pc) {
      throw new Error('PeerConnection not initialized');
    }
    
    // Create data channel
    const dataChannel = this.pc.createDataChannel('oai-events');
    this.dc = dataChannel;
    
    // Set up data channel event handlers
    dataChannel.onopen = () => {
      console.log('Data channel open');
      this.onDataChannelOpen();
    };
    
    dataChannel.onmessage = (event) => {
      this.onMessage(JSON.parse(event.data));
    };
    
    return dataChannel;
  }
  
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.pc) {
      throw new Error('PeerConnection not initialized');
    }
    
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }
  
  async setRemoteDescription(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) {
      throw new Error('PeerConnection not initialized');
    }
    
    await this.pc.setRemoteDescription(answer);
  }
  
  addTrack(track: MediaStreamTrack, stream: MediaStream): void {
    if (!this.pc) {
      throw new Error('PeerConnection not initialized');
    }
    
    this.pc.addTrack(track, stream);
  }
  
  sendMessage(message: any): void {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('Cannot send message: data channel not open');
      return;
    }
    
    try {
      this.dc.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  
  close(): void {
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
  }
}
