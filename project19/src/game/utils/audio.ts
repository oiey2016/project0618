class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);
      this.initialized = true;
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  private ensureContext(): void {
    if (!this.initialized) {
      this.init();
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    this.ensureContext();
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playFootstep(): void {
    this.playTone(80 + Math.random() * 40, 0.05, 'square', 0.1);
  }

  playKeyCollect(): void {
    this.playTone(523, 0.1, 'sine', 0.3);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.3), 200);
  }

  playHide(): void {
    this.playTone(200, 0.15, 'sine', 0.2);
    setTimeout(() => this.playTone(150, 0.2, 'sine', 0.2), 100);
  }

  playSpotted(): void {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playTone(400 + i * 100, 0.15, 'sawtooth', 0.4), i * 80);
    }
  }

  playChase(): void {
    this.playTone(100 + Math.random() * 50, 0.3, 'sawtooth', 0.3);
  }

  playHeartbeat(speed: number = 1): void {
    this.playTone(60, 0.1, 'sine', 0.4 / speed);
    setTimeout(() => this.playTone(50, 0.15, 'sine', 0.3 / speed), 150 / speed);
  }

  playWin(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'sine', 0.3), i * 150);
    });
  }

  playLose(): void {
    const notes = [400, 350, 300, 200];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.4, 'sawtooth', 0.3), i * 200);
    });
  }

  playDoorUnlock(): void {
    this.playTone(300, 0.1, 'square', 0.3);
    setTimeout(() => this.playTone(500, 0.15, 'square', 0.3), 100);
    setTimeout(() => this.playTone(800, 0.2, 'square', 0.3), 250);
  }
}

export const audioManager = new AudioManager();
