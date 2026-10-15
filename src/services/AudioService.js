class AudioService {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.bgmInterval = null;
    this.bgmTimeouts = [];
    this.isPlayingBgm = false;
    this.bgmSession = 0;
  }

  /**
   * Cria (lazy) e retoma o AudioContext.
   * Deve ser chamado de dentro de um gesto do usuário (click/keydown) para
   * respeitar a política de Autoplay dos navegadores. Nunca lança erro e nunca
   * deixa Promises rejeitadas sem tratamento (evita warnings no console).
   * @returns {Promise<boolean>} true se o contexto estiver rodando.
   */
  initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return Promise.resolve(false);
      try {
        this.audioCtx = new AudioCtx();
      } catch (e) {
        console.warn('AudioContext indisponível', e);
        return Promise.resolve(false);
      }
    }

    if (this.audioCtx.state === 'suspended') {
      return this.audioCtx
        .resume()
        .then(() => this.audioCtx.state === 'running')
        .catch(() => false); // Bloqueado pelo autoplay: falha silenciosa
    }

    return Promise.resolve(this.audioCtx.state === 'running');
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
    // Sincronamente cria/retoma o contexto (precisa estar no gesto do usuário).
    this.initContext();
    if (!this.audioCtx || this.audioCtx.state === 'closed') return;

    try {
      const now = this.audioCtx.currentTime;
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(vol, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
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
    this.isPlayingBgm = true;

    // Gentle retro ambient chord progression (Cmaj7 -> Am7 -> Fmaj7 -> G)
    const chordNotes = [
      [261.63, 329.63, 392.00], // C chord
      [220.00, 261.63, 329.63], // Am chord
      [174.61, 220.00, 261.63], // F chord
      [196.00, 246.94, 293.66]  // G chord
    ];

    let step = 0;
    const playChord = () => {
      if (this.isMuted || !this.isPlayingBgm) return;
      const currentChord = chordNotes[step % chordNotes.length];
      currentChord.forEach((freq, idx) => {
        const t = setTimeout(() => {
          this.bgmTimeouts = this.bgmTimeouts.filter((id) => id !== t);
          if (this.isPlayingBgm && !this.isMuted) {
            this.playTone(freq * 2, 'sine', 1.4, 0.18);
          }
        }, idx * 250);
        this.bgmTimeouts.push(t);
      });
      step++;
    };

    // initContext() é chamado aqui de forma síncrona (dentro do clique);
    // a trilha só começa quando o contexto estiver de fato rodando.
    const session = ++this.bgmSession;
    this.initContext().then((running) => {
      if (session !== this.bgmSession) return; // start/stop mais recente venceu
      if (!running || !this.isPlayingBgm || this.isMuted) {
        // Autoplay bloqueado: libera para uma nova tentativa no próximo gesto.
        if (!running) this.isPlayingBgm = false;
        return;
      }
      playChord(); // Primeiro acorde imediato, junto com a transição de tela
      this.bgmInterval = setInterval(playChord, 2400);
    });
  }

  stopBgm() {
    this.bgmSession++;
    this.isPlayingBgm = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmTimeouts.forEach(clearTimeout);
    this.bgmTimeouts = [];
  }
}

export const audioService = new AudioService();
