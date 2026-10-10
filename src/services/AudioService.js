class AudioService {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.bgmInterval = null;
    this.isPlayingBgm = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  playTone(freq, type, duration, vol = 0.3) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playClick() {
    this.playTone(523.25, 'triangle', 0.1, 0.35); // Audible C5 click
  }

  playConfirm() {
    this.playTone(659.25, 'sine', 0.12, 0.45); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.45), 90); // G5
  }

  startBgm() {
    if (this.isPlayingBgm || this.isMuted) return;
    this.initContext();
    this.isPlayingBgm = true;

    // Gentle retro ambient chord progression (Cmaj7 -> Am7 -> Fmaj7 -> G)
    const chordNotes = [
      [261.63, 329.63, 392.00], // C chord
      [220.00, 261.63, 329.63], // Am chord
      [174.61, 220.00, 261.63], // F chord
      [196.00, 246.94, 293.66]  // G chord
    ];

    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.isPlayingBgm) return;
      const currentChord = chordNotes[step % chordNotes.length];
      currentChord.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq * 2, 'sine', 1.4, 0.18);
        }, idx * 250);
      });
      step++;
    }, 2400);
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioService = new AudioService();
