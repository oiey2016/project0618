let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  freqEnd?: number,
) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), now + duration);
  }

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.05);
}

function playNoise(duration: number, volume = 0.1, filterFreq = 1000) {
  const ctx = getCtx();
  if (!ctx) return;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start();
  source.stop(ctx.currentTime + duration + 0.02);
}

export const SFX = {
  charge() {
    playTone(220, 0.12, 'square', 0.08, 440);
  },

  throw() {
    playTone(600, 0.08, 'sawtooth', 0.1, 200);
    playNoise(0.05, 0.04, 2000);
  },

  hit() {
    playTone(140, 0.18, 'square', 0.18, 60);
    playNoise(0.12, 0.1, 500);
  },

  catch() {
    playTone(880, 0.08, 'sine', 0.12);
    setTimeout(() => playTone(1175, 0.1, 'sine', 0.12), 50);
    setTimeout(() => playTone(1568, 0.14, 'sine', 0.1), 100);
  },

  rescue() {
    playTone(523, 0.1, 'triangle', 0.14);
    setTimeout(() => playTone(659, 0.1, 'triangle', 0.14), 80);
    setTimeout(() => playTone(784, 0.1, 'triangle', 0.14), 160);
    setTimeout(() => playTone(1047, 0.2, 'triangle', 0.16), 240);
  },

  bounce() {
    playNoise(0.04, 0.05, 1500);
  },

  countdown(num: number) {
    if (num > 0) {
      playTone(440, 0.15, 'square', 0.12);
    } else {
      playTone(880, 0.3, 'square', 0.15, 1760);
    }
  },

  victory() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => {
      setTimeout(() => playTone(n, 0.25, 'triangle', 0.14), i * 100);
    });
  },

  menuClick() {
    playTone(500, 0.05, 'square', 0.1);
  },

  playerOut() {
    playTone(300, 0.1, 'sawtooth', 0.1, 80);
    playNoise(0.15, 0.08, 400);
  },
};

export function unlockAudio() {
  getCtx();
}
