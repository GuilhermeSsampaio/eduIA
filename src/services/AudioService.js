class AudioService {
  constructor() {
    // In a real app, you would load actual audio files here.
    // We are simulating with Web Audio API for the beep/boop retro sounds.
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playTone(freq, type, duration, vol=0.1) {
    if (!this.audioCtx) return;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  playClick() {
    this.playTone(440, 'square', 0.1, 0.05); // Short blip
  }

  playConfirm() {
    this.playTone(600, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(800, 'sine', 0.2, 0.1), 100);
  }
}

export const audioService = new AudioService();
