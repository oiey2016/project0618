import type { MelodyNote, JudgmentType } from '@/types/game';

class AudioSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private startTime: number = 0;
  private activeNodes: OscillatorNode[] = [];
  private isPlaying: boolean = false;

  async init(): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.audioContext.destination);

    this.musicGain = this.audioContext.createGain();
    this.musicGain.gain.value = 0.35;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.gain.value = 0.25;
    this.sfxGain.connect(this.masterGain);

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private ensureContext(): AudioContext {
    if (!this.audioContext) {
      throw new Error('Audio system not initialized');
    }
    return this.audioContext;
  }

  playMelody(melody: MelodyNote[]): void {
    const ctx = this.ensureContext();
    if (!this.musicGain) return;

    this.stopAll();
    this.startTime = ctx.currentTime;
    this.isPlaying = true;

    melody.forEach((note) => {
      if (note.frequency <= 0) return;

      const startTime = this.startTime + note.time / 1000;
      const duration = Math.min(note.duration / 1000, 0.5);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.frequency, startTime);

      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.setValueAtTime(0.3, startTime + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);

      this.activeNodes.push(osc);
    });
  }

  playJudgment(type: JudgmentType): void {
    const ctx = this.ensureContext();
    if (!this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = type === 'perfect' ? 880 : type === 'great' ? 660 : type === 'good' ? 440 : 220;

    osc.type = type === 'miss' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    if (type === 'perfect') {
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);
    }

    const volume = type === 'miss' ? 0.15 : 0.25;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playClick(): void {
    const ctx = this.ensureContext();
    if (!this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  getCurrentTime(): number {
    const ctx = this.ensureContext();
    if (!this.isPlaying) return 0;
    return (ctx.currentTime - this.startTime) * 1000;
  }

  seek(timeMs: number): void {
    const ctx = this.ensureContext();
    this.startTime = ctx.currentTime - timeMs / 1000;
  }

  stopAll(): void {
    this.activeNodes.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.activeNodes = [];
    this.isPlaying = false;

    if (this.musicGain && this.audioContext) {
      try {
        this.musicGain.gain.cancelScheduledValues(this.audioContext.currentTime);
        this.musicGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.musicGain.gain.setValueAtTime(0.35, this.audioContext.currentTime + 0.05);
      } catch {}
    }
    if (this.sfxGain && this.audioContext) {
      try {
        this.sfxGain.gain.cancelScheduledValues(this.audioContext.currentTime);
        this.sfxGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.sfxGain.gain.setValueAtTime(0.25, this.audioContext.currentTime + 0.05);
      } catch {}
    }
  }

  async reset(): Promise<void> {
    this.destroy();
    await this.init();
  }

  destroy(): void {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
    }
    this.startTime = 0;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

export const audioSystem = new AudioSystem();
