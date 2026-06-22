import { PIANO_FREQUENCIES, PIANO_KEY_NOTES } from '@/types';

class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;
  private initialized: boolean = false;
  private activeOscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();
  private melodyGain: GainNode | null = null;
  private padOscillators: Array<{ osc: OscillatorNode; gain: GainNode }> = [];

  init(): void {
    if (this.initialized) return;
    try {
      this.context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.context.destination);

      this.melodyGain = this.context.createGain();
      this.melodyGain.gain.value = 0.6;
      this.melodyGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API 初始化失败:', e);
    }
  }

  resume(): void {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  playNote(keyIndex: number, velocity: number = 1, duration: number = 0.8): void {
    if (!this.context || !this.melodyGain || !this.initialized) return;

    const noteName = PIANO_KEY_NOTES[keyIndex] || 'C4';
    const freq = PIANO_FREQUENCIES[noteName] || 261.63;

    const noteId = `${noteName}-${Date.now()}-${Math.random()}`;
    const ctx = this.context;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.value = freq;

    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;

    filter.type = 'lowpass';
    filter.frequency.value = freq * 8;
    filter.Q.value = 0.5;

    const now = ctx.currentTime;
    const peak = 0.008 * velocity;
    const sustain = 0.18 * velocity;
    const release = duration * 0.6;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak * 0.7, now + 0.01);
    gain.gain.linearRampToValueAtTime(sustain, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + release);

    osc2.detune.value = 7;

    osc1.connect(filter);
    osc2.connect(gain);
    filter.connect(gain);
    gain.connect(this.melodyGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + release + 0.1);
    osc2.stop(now + release + 0.1);

    this.activeOscillators.set(noteId, { osc: osc1, gain });
    setTimeout(() => {
      this.activeOscillators.delete(noteId);
    }, (release + 0.2) * 1000);
  }

  playBackgroundPad(): void {
    if (!this.context || !this.masterGain || !this.initialized) return;

    const ctx = this.context;
    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    padGain.connect(this.masterGain);

    const now = ctx.currentTime;
    const padDuration = 8;

    this.stopBackgroundPad();

    [130.81, 196.00, 261.63].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const g = ctx.createGain();
      g.gain.value = 0.035 - i * 0.008;

      osc.connect(g);
      g.connect(padGain);
      osc.start(now);

      padGain.gain.linearRampToValueAtTime(1, now + 3);
      padGain.gain.setValueAtTime(1, now + padDuration - 1.5);
      padGain.gain.linearRampToValueAtTime(0.001, now + padDuration);

      osc.stop(now + padDuration + 0.1);
      this.padOscillators.push({ osc, gain: padGain });
    });
  }

  stopBackgroundPad(): void {
    if (!this.context) return;
    const now = this.context.currentTime;
    this.padOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        osc.stop(now + 0.6);
      } catch {
        // ignore
      }
    });
    this.padOscillators = [];
  }

  stopAll(): void {
    if (!this.context) return;
    const now = this.context.currentTime;

    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.stop(now + 0.2);
      } catch {
        // ignore
      }
    });
    this.activeOscillators.clear();

    this.stopBackgroundPad();
  }

  playSfx(type: 'perfect' | 'great' | 'good' | 'miss'): void {
    if (!this.context || !this.masterGain || !this.initialized) return;

    const ctx = this.context;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === 'perfect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else if (type === 'great') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.07);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    } else if (type === 'good') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    }

    osc.start(now);
    osc.stop(now + 0.2);
  }

  destroy(): void {
    this.stopAll();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.initialized = false;
  }
}

export const audioEngine = new AudioEngine();
