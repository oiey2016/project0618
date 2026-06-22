export type AudioJudgementType = 'perfect' | 'great' | 'good' | 'miss';

class AudioManager {
  private static instance: AudioManager | null = null;

  private audioContext: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private metronomeInterval: number | null = null;
  private bgmInterval: number | null = null;
  private bgmIsPlaying = false;

  private musicVolume = 0.7;
  private sfxVolume = 0.5;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  ensureContext(): AudioContext | null {
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return this.audioContext;
    }

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;

      const ctx = new Ctx();

      const musicGain = ctx.createGain();
      musicGain.gain.value = this.musicVolume;
      musicGain.connect(ctx.destination);
      this.musicGain = musicGain;

      const sfxGain = ctx.createGain();
      sfxGain.gain.value = this.sfxVolume;
      sfxGain.connect(ctx.destination);
      this.sfxGain = sfxGain;

      this.audioContext = ctx;
      return ctx;
    } catch (e) {
      console.error('[AudioManager] Failed to create AudioContext:', e);
      return null;
    }
  }

  activateInGesture(): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.01);
    osc.connect(gain);
    gain.connect(this.sfxGain || ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.01);

    return true;
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playHitSound(type: AudioJudgementType) {
    const frequencies: Record<AudioJudgementType, number[]> = {
      perfect: [880, 1100, 1320],
      great: [660, 880],
      good: [440, 550],
      miss: [200, 150],
    };

    const freqs = frequencies[type];
    const duration = type === 'miss' ? 0.15 : 0.2;
    const waveform = type === 'miss' ? 'sawtooth' : 'sine';
    const volume = type === 'miss' ? 0.2 : 0.3;

    freqs.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, duration, waveform, volume), i * 30);
    });
  }

  playClick() {
    this.playTone(600, 0.08, 'square', 0.2);
  }

  startMetronome(bpm: number) {
    const interval = 60000 / bpm;
    let beat = 0;

    const tick = () => {
      if (beat % 4 === 0) {
        this.playTone(880, 0.05, 'sine', 0.25);
      } else {
        this.playTone(440, 0.05, 'sine', 0.2);
      }
      beat++;
    };

    tick();
    this.metronomeInterval = window.setInterval(tick, interval);
  }

  stopMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
  }

  private BGM_NOTES = [
    { freq: 261.63, dur: 0.4 },
    { freq: 329.63, dur: 0.4 },
    { freq: 392.00, dur: 0.4 },
    { freq: 523.25, dur: 0.8 },
    { freq: 392.00, dur: 0.4 },
    { freq: 329.63, dur: 0.4 },
    { freq: 293.66, dur: 0.4 },
    { freq: 261.63, dur: 0.8 },
  ];

  private BGM_BASS = [
    { freq: 130.81, dur: 0.8 },
    { freq: 164.81, dur: 0.8 },
    { freq: 196.00, dur: 0.8 },
    { freq: 164.81, dur: 0.8 },
  ];

  private playMusicNote(frequency: number, duration: number, startTime: number, type: OscillatorType = 'triangle') {
    const ctx = this.audioContext;
    if (!ctx || !this.musicGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.35, startTime + 0.05);
    gain.gain.setValueAtTime(0.25, startTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private scheduleBGM() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    let noteTime = ctx.currentTime + 0.05;
    let bassTime = ctx.currentTime + 0.05;

    const totalMelodyDuration = this.BGM_NOTES.reduce((sum, n) => sum + n.dur, 0);

    for (let loop = 0; loop < 8; loop++) {
      this.BGM_NOTES.forEach((note) => {
        this.playMusicNote(note.freq, note.dur, noteTime, 'triangle');
        noteTime += note.dur;
      });

      if (loop % 2 === 0) {
        this.BGM_BASS.forEach((note) => {
          this.playMusicNote(note.freq, note.dur, bassTime, 'sine');
          bassTime += note.dur;
        });
      } else {
        bassTime += totalMelodyDuration;
      }
    }
  }

  startBackgroundMusic() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
    }

    this.bgmIsPlaying = true;
    this.scheduleBGM();

    const totalLoopTime = 12.8;
    this.bgmInterval = window.setInterval(() => {
      if (this.bgmIsPlaying && this.audioContext?.state === 'running') {
        this.scheduleBGM();
      }
    }, totalLoopTime * 1000);
  }

  stopBackgroundMusic() {
    this.bgmIsPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  pauseBackgroundMusic() {
    this.bgmIsPlaying = false;
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
  }

  resumeBackgroundMusic() {
    this.bgmIsPlaying = true;
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && this.audioContext) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && this.audioContext) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
    }
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSfxVolume() {
    return this.sfxVolume;
  }

  getContextState(): string {
    return this.audioContext?.state || 'none';
  }
}

export const audioManager = AudioManager.getInstance();

if (typeof window !== 'undefined') {
  (window as unknown as { __audioManager?: typeof audioManager }).__audioManager = audioManager;
  console.log('[AudioManager] 已挂载到 window.__audioManager，可调试');
}
