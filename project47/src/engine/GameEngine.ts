import type {
  Song,
  ActiveNote,
  Particle,
  JudgeType,
  ScenePhase,
  Note,
  StorySegment,
  JudgeDisplay,
} from '@/types';
import {
  FALL_DURATION,
  JUDGE_WINDOWS,
  JUDGE_SCORES,
  KEY_COUNT,
} from '@/types';
import { audioEngine } from '@/audio/AudioEngine';

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  judges: Record<JudgeType, number>;
  progress: number;
}

export interface GameCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onJudge: (type: JudgeType, x: number, y: number) => void;
  onStory: (segment: StorySegment | null) => void;
  onComplete: () => void;
  onScenePhaseChange: (phase: ScenePhase, blend: number) => void;
}

const SCENE_PHASES: ScenePhase[] = ['dawn', 'noon', 'dusk', 'night'];

let particleIdCounter = 0;
let judgeDisplayIdCounter = 0;

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private song: Song;
  private callbacks: GameCallbacks;

  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  private running: boolean = false;
  private paused: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = 0;

  private currentTime: number = -3000;
  private countdown: number = 3;
  private status: 'countdown' | 'playing' | 'ended' = 'countdown';

  private score: number = 0;
  private combo: number = 0;
  private maxCombo: number = 0;
  private judges: Record<JudgeType, number> = {
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
  };

  private activeNotes: ActiveNote[] = [];
  private noteIndex: number = 0;
  private pressedKeys: Set<number> = new Set();
  private keyPressTime: Map<number, number> = new Map();

  private particles: Particle[] = [];
  private judgeDisplays: JudgeDisplay[] = [];
  private ambientParticles: Particle[] = [];

  private currentStory: StorySegment | null = null;
  private storyTimer: number = 0;
  private storyTriggered: Set<number> = new Set();

  private scenePhase: ScenePhase = 'dawn';
  private sceneBlend: number = 0;

  private noteSpeed: number = 1.0;
  private fallDuration: number = FALL_DURATION;

  private keyAreaHeight: number = 140;
  private judgeLineY: number = 0;
  private laneWidth: number = 0;
  private keyWidth: number = 0;

  private statsThrottle: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    song: Song,
    callbacks: GameCallbacks,
    noteSpeed: number = 1.0,
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
    this.song = song;
    this.callbacks = callbacks;
    this.noteSpeed = noteSpeed;
    this.fallDuration = FALL_DURATION / noteSpeed;

    this.resize();
    this.initAmbientParticles();
  }

  private initAmbientParticles(): void {
    this.ambientParticles = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push(this.createAmbientParticle(true));
    }
  }

  private createAmbientParticle(randomY: boolean = false): Particle {
    return {
      id: particleIdCounter++,
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.2 + Math.random() * 0.5,
      life: 1,
      maxLife: 1,
      size: 2 + Math.random() * 4,
      color: this.getParticleColor(),
      type: 'ambient',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    };
  }

  private getParticleColor(): string {
    const palette = [
      'rgba(255, 179, 71, 0.6)',
      'rgba(255, 215, 120, 0.5)',
      'rgba(232, 180, 212, 0.5)',
      'rgba(201, 168, 230, 0.5)',
      'rgba(139, 157, 195, 0.4)',
      'rgba(255, 255, 255, 0.7)',
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  resize(): void {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.keyAreaHeight = Math.max(120, this.height * 0.2);
    this.judgeLineY = this.height - this.keyAreaHeight - 4;
    this.laneWidth = this.width / KEY_COUNT;
    this.keyWidth = this.laneWidth - 4;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.paused = false;
    this.lastTime = performance.now();
    this.loop();
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    if (!this.running) return;
    this.paused = false;
    this.lastTime = performance.now();
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    audioEngine.stopAll();
  }

  pressKey(keyIndex: number): void {
    if (this.status !== 'playing' && this.status !== 'countdown') return;
    if (this.pressedKeys.has(keyIndex)) return;

    this.pressedKeys.add(keyIndex);
    this.keyPressTime.set(keyIndex, this.currentTime);

    audioEngine.playNote(keyIndex, 0.85);
    this.createKeyPressParticles(keyIndex);

    if (this.status === 'playing') {
      this.judgeKeyPress(keyIndex);
    }
  }

  releaseKey(keyIndex: number): void {
    this.pressedKeys.delete(keyIndex);
    this.keyPressTime.delete(keyIndex);
  }

  private judgeKeyPress(keyIndex: number): void {
    const candidates = this.activeNotes.filter(
      (n) =>
        n.key === keyIndex &&
        !n.hit &&
        !n.missed,
    );

    if (candidates.length === 0) return;

    candidates.sort(
      (a, b) =>
        Math.abs(a.time - this.currentTime) - Math.abs(b.time - this.currentTime),
    );

    const note = candidates[0];
    const delta = Math.abs(note.time - this.currentTime);

    let judgeType: JudgeType;
    if (delta <= JUDGE_WINDOWS.perfect) {
      judgeType = 'perfect';
    } else if (delta <= JUDGE_WINDOWS.great) {
      judgeType = 'great';
    } else if (delta <= JUDGE_WINDOWS.good) {
      judgeType = 'good';
    } else {
      return;
    }

    note.hit = true;
    note.judgeType = judgeType;
    note.particlePhase = 0;

    this.score += JUDGE_SCORES[judgeType] + Math.floor(this.combo * 0.5);
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.judges[judgeType]++;

    this.createHitParticles(keyIndex, judgeType);

    const keyCenterX = keyIndex * this.laneWidth + this.laneWidth / 2;
    this.callbacks.onJudge(judgeType, keyCenterX, this.judgeLineY - 60);

    audioEngine.playSfx(judgeType);
  }

  private createKeyPressParticles(keyIndex: number): void {
    const centerX = keyIndex * this.laneWidth + this.laneWidth / 2;
    const baseY = this.height - this.keyAreaHeight * 0.4;

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 6) * i - Math.PI / 2 - Math.PI / 12;
      const speed = 1 + Math.random() * 2;
      this.particles.push({
        id: particleIdCounter++,
        x: centerX + (Math.random() - 0.5) * 20,
        y: baseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 4,
        color: 'rgba(255, 179, 71, 0.85)',
        type: 'hit',
      });
    }
  }

  private createHitParticles(keyIndex: number, type: JudgeType): void {
    const centerX = keyIndex * this.laneWidth + this.laneWidth / 2;
    const baseY = this.judgeLineY;

    const colors: Record<JudgeType, string[]> = {
      perfect: [
        'rgba(255, 215, 0, 1)',
        'rgba(255, 179, 71, 0.95)',
        'rgba(255, 230, 120, 0.9)',
      ],
      great: [
        'rgba(255, 179, 71, 0.95)',
        'rgba(255, 140, 80, 0.9)',
        'rgba(255, 200, 100, 0.85)',
      ],
      good: [
        'rgba(139, 157, 195, 0.95)',
        'rgba(201, 168, 230, 0.9)',
        'rgba(170, 180, 210, 0.85)',
      ],
      miss: [
        'rgba(231, 76, 60, 0.9)',
        'rgba(255, 120, 100, 0.85)',
      ],
    };

    const palette = colors[type];
    const count = type === 'perfect' ? 20 : type === 'great' ? 14 : 8;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        id: particleIdCounter++,
        x: centerX,
        y: baseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 5,
        color: palette[i % palette.length],
        type: 'hit',
      });
    }
  }

  private loop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    let delta = now - this.lastTime;
    this.lastTime = now;

    if (delta > 100) delta = 100;

    if (!this.paused) {
      this.update(delta);
    }
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(delta: number): void {
    this.currentTime += delta;

    if (this.status === 'countdown') {
      const newCountdown = Math.ceil((-this.currentTime) / 1000);
      if (newCountdown !== this.countdown) {
        this.countdown = newCountdown;
      }
      if (this.currentTime >= 0) {
        this.status = 'playing';
        audioEngine.playBackgroundPad();
      }
    }

    if (this.status === 'playing') {
      this.scheduleNotes();
      this.updateActiveNotes(delta);
      this.checkMissedNotes();
      this.checkStorySegments(delta);
      this.updateScenePhase();
      this.checkEnd();
    }

    this.updateParticles(delta);
    this.updateAmbientParticles(delta);
    this.updateJudgeDisplays(delta);

    this.statsThrottle += delta;
    if (this.statsThrottle >= 50) {
      this.statsThrottle = 0;
      this.emitStats();
    }
  }

  private scheduleNotes(): void {
    const startVisible = this.currentTime + this.fallDuration * 1.2;

    while (
      this.noteIndex < this.song.notes.length &&
      this.song.notes[this.noteIndex].time <= startVisible
    ) {
      const note = this.song.notes[this.noteIndex];
      this.activeNotes.push({
        ...note,
        y: -60,
        hit: false,
        missed: false,
        particlePhase: 0,
      });
      this.noteIndex++;
    }
  }

  private updateActiveNotes(delta: number): void {
    const fallSpeed = (this.judgeLineY + 60) / this.fallDuration;

    for (const note of this.activeNotes) {
      if (note.hit) {
        note.particlePhase += delta / 400;
      } else if (!note.missed) {
        const targetY = this.judgeLineY;
        const timeToHit = note.time - this.currentTime;
        const progress = 1 - timeToHit / this.fallDuration;
        note.y = -60 + (targetY + 60) * Math.max(0, Math.min(1.2, progress));
        void fallSpeed;
      }
    }

    this.activeNotes = this.activeNotes.filter(
      (n) => !(n.hit && n.particlePhase >= 1) && !(n.missed && n.y > this.height + 100),
    );
  }

  private checkMissedNotes(): void {
    for (const note of this.activeNotes) {
      if (note.hit || note.missed) continue;

      if (this.currentTime - note.time > JUDGE_WINDOWS.good + 50) {
        note.missed = true;
        this.judges.miss++;
        this.combo = 0;

        const keyCenterX = note.key * this.laneWidth + this.laneWidth / 2;
        this.callbacks.onJudge('miss', keyCenterX, this.judgeLineY - 60);
        audioEngine.playSfx('miss');
      }
    }
  }

  private checkStorySegments(delta: number): void {
    for (const segment of this.song.storySegments) {
      if (
        this.storyTriggered.has(segment.id) ||
        this.currentTime < segment.time
      ) {
        continue;
      }

      if (
        !this.currentStory &&
        this.currentTime >= segment.time &&
        this.currentTime < segment.time + 100
      ) {
        this.storyTriggered.add(segment.id);
        this.currentStory = segment;
        this.storyTimer = 0;
        this.callbacks.onStory(segment);
      }
    }

    if (this.currentStory) {
      this.storyTimer += delta;
      if (this.storyTimer >= this.currentStory.duration) {
        this.currentStory = null;
        this.callbacks.onStory(null);
      }
    }
  }

  private updateScenePhase(): void {
    const progress = Math.max(0, this.currentTime / this.song.duration);
    const phaseCount = SCENE_PHASES.length;
    const phaseProgress = Math.min(progress * phaseCount, phaseCount - 0.01);
    const phaseIndex = Math.floor(phaseProgress);
    const blend = phaseProgress - phaseIndex;

    if (SCENE_PHASES[phaseIndex] !== this.scenePhase) {
      this.scenePhase = SCENE_PHASES[phaseIndex];
    }
    if (Math.abs(blend - this.sceneBlend) > 0.01) {
      this.sceneBlend = blend;
    }

    this.callbacks.onScenePhaseChange(this.scenePhase, this.sceneBlend);
  }

  private checkEnd(): void {
    if (
      this.currentTime >= this.song.duration + 1500 &&
      this.status === 'playing'
    ) {
      this.status = 'ended';
      this.callbacks.onComplete();
    }
  }

  private updateParticles(delta: number): void {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= delta / 600;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  private updateAmbientParticles(delta: number): void {
    const factor = delta / 16;
    for (const p of this.ambientParticles) {
      p.x += p.vx * factor;
      p.y += p.vy * factor;
      if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
        p.rotation += p.rotationSpeed * factor;
      }

      if (p.y > this.height + 30 || p.x < -30 || p.x > this.width + 30) {
        Object.assign(p, this.createAmbientParticle());
      }
    }
  }

  private updateJudgeDisplays(delta: number): void {
    this.judgeDisplays = this.judgeDisplays.filter(
      (jd) => performance.now() - jd.createdAt < 900,
    );
    void delta;
  }

  addJudgeDisplay(type: JudgeType, x: number, y: number): void {
    this.judgeDisplays.push({
      id: judgeDisplayIdCounter++,
      type,
      x,
      y,
      createdAt: performance.now(),
    });
  }

  private emitStats(): void {
    this.callbacks.onStatsUpdate({
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      judges: { ...this.judges },
      progress: Math.max(0, Math.min(1, this.currentTime / this.song.duration)),
    });
  }

  getStats(): GameStats {
    return {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      judges: { ...this.judges },
      progress: Math.max(0, Math.min(1, this.currentTime / this.song.duration)),
    };
  }

  private render(): void {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    this.renderSceneBackground();
    this.renderAmbientParticles();
    this.renderLanes();
    this.renderNotes();
    this.renderParticles();
    this.renderJudgeLine();
    this.renderPianoKeys();
    this.renderKeyPressGlow();
    this.renderJudgeDisplays();
    this.renderCountdown();
  }

  private renderSceneBackground(): void {
    const colors = this.song.sceneColors;
    const currentColors = colors[this.scenePhase];
    const nextPhaseIdx = Math.min(SCENE_PHASES.indexOf(this.scenePhase) + 1, SCENE_PHASES.length - 1);
    const nextColors = colors[SCENE_PHASES[nextPhaseIdx]];
    const blend = this.scenePhase === 'night' ? 0 : this.sceneBlend;

    const lerp = (a: string, b: string, t: number) => {
      const ah = a.replace('#', '');
      const bh = b.replace('#', '');
      const ar = parseInt(ah.slice(0, 2), 16);
      const ag = parseInt(ah.slice(2, 4), 16);
      const ab = parseInt(ah.slice(4, 6), 16);
      const br = parseInt(bh.slice(0, 2), 16);
      const bg = parseInt(bh.slice(2, 4), 16);
      const bb = parseInt(bh.slice(4, 6), 16);
      const r = Math.round(ar + (br - ar) * t);
      const g = Math.round(ag + (bg - ag) * t);
      const bi = Math.round(ab + (bb - ab) * t);
      return `rgb(${r}, ${g}, ${bi})`;
    };

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    const stops = [0, 0.35, 0.7, 1];
    stops.forEach((pos, i) => {
      gradient.addColorStop(pos, lerp(currentColors[i], nextColors[i], blend));
    });

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.renderSceneDecor();
  }

  private renderSceneDecor(): void {
    const ctx = this.ctx;

    if (this.scenePhase === 'dusk' || this.scenePhase === 'night') {
      ctx.fillStyle = this.scenePhase === 'night'
        ? 'rgba(20, 15, 40, 0.85)'
        : 'rgba(80, 60, 100, 0.35)';
      ctx.beginPath();
      const baseY = this.judgeLineY - 20;
      ctx.moveTo(0, baseY + 40);
      for (let x = 0; x <= this.width; x += 80) {
        const h = 50 + Math.sin(x * 0.02) * 35 + Math.sin(x * 0.008) * 25;
        ctx.lineTo(x, baseY - h);
      }
      ctx.lineTo(this.width, baseY + 40);
      ctx.closePath();
      ctx.fill();
    }

    if (this.scenePhase === 'night') {
      for (let i = 0; i < 40; i++) {
        const x = (i * 137.5) % this.width;
        const y = ((i * 97.3) % (this.judgeLineY - 120)) + 20;
        const flicker = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(performance.now() / 500 + i * 2.1));
        const size = 1 + (i % 3) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * flicker})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (this.scenePhase === 'dawn' || this.scenePhase === 'noon') {
      const lightX = this.width * 0.8;
      const lightY = this.height * 0.12;
      const glow = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, 280);
      glow.addColorStop(0, 'rgba(255, 230, 150, 0.35)');
      glow.addColorStop(0.5, 'rgba(255, 200, 120, 0.1)');
      glow.addColorStop(1, 'rgba(255, 180, 100, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, this.width, this.height * 0.6);
    }
  }

  private renderAmbientParticles(): void {
    const ctx = this.ctx;
    for (const p of this.ambientParticles) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = p.color;
      if (p.rotation !== undefined) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private renderLanes(): void {
    const ctx = this.ctx;

    for (let i = 0; i < KEY_COUNT; i++) {
      const x = i * this.laneWidth;
      ctx.strokeStyle = i === 0 || i === KEY_COUNT - 1
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + this.laneWidth / 2, 0);
      ctx.lineTo(x + this.laneWidth / 2, this.judgeLineY);
      ctx.stroke();
    }
  }

  private renderNotes(): void {
    const ctx = this.ctx;

    for (const note of this.activeNotes) {
      if (note.hit) {
        const t = note.particlePhase;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - t);
        const x = note.key * this.laneWidth + this.laneWidth / 2;
        const scale = 1 + t * 1.5;
        const glowRadius = (this.keyWidth * 0.6) * scale;
        const glow = ctx.createRadialGradient(x, note.y, 0, x, note.y, glowRadius);
        const color = note.judgeType === 'perfect'
          ? '255, 215, 0'
          : note.judgeType === 'great'
            ? '255, 179, 71'
            : '139, 157, 195';
        glow.addColorStop(0, `rgba(${color}, ${0.9 * (1 - t)})`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, note.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }

      const x = note.key * this.laneWidth + this.laneWidth / 2;
      const w = this.keyWidth * 0.78;
      const h = 22;
      const y = note.y - h / 2;

      const gradient = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y + h);
      gradient.addColorStop(0, '#FFD88A');
      gradient.addColorStop(0.5, '#FFB347');
      gradient.addColorStop(1, '#F59E30');

      const glow = ctx.createRadialGradient(x, note.y, 0, x, note.y, w * 0.9);
      glow.addColorStop(0, 'rgba(255, 179, 71, 0.45)');
      glow.addColorStop(1, 'rgba(255, 179, 71, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, note.y, w * 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = gradient;
      ctx.beginPath();
      const radius = h / 2;
      ctx.moveTo(x - w / 2 + radius, y);
      ctx.lineTo(x + w / 2 - radius, y);
      ctx.quadraticCurveTo(x + w / 2, y, x + w / 2, y + radius);
      ctx.lineTo(x + w / 2, y + h - radius);
      ctx.quadraticCurveTo(x + w / 2, y + h, x + w / 2 - radius, y + h);
      ctx.lineTo(x - w / 2 + radius, y + h);
      ctx.quadraticCurveTo(x - w / 2, y + h, x - w / 2, y + h - radius);
      ctx.lineTo(x - w / 2, y + radius);
      ctx.quadraticCurveTo(x - w / 2, y, x - w / 2 + radius, y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillRect(x - w / 2 + 8, y + 4, w - 16, 3);
    }
  }

  private renderParticles(): void {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderJudgeLine(): void {
    const ctx = this.ctx;

    const gradient = ctx.createLinearGradient(0, this.judgeLineY, this.width, this.judgeLineY);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.15, 'rgba(255, 179, 71, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 120, 0.85)');
    gradient.addColorStop(0.85, 'rgba(255, 179, 71, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(20, this.judgeLineY);
    ctx.lineTo(this.width - 20, this.judgeLineY);
    ctx.stroke();

    const glow = ctx.createLinearGradient(0, this.judgeLineY - 30, 0, this.judgeLineY + 30);
    glow.addColorStop(0, 'rgba(255, 179, 71, 0)');
    glow.addColorStop(0.5, 'rgba(255, 179, 71, 0.08)');
    glow.addColorStop(1, 'rgba(255, 179, 71, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, this.judgeLineY - 30, this.width, 60);
  }

  private renderPianoKeys(): void {
    const ctx = this.ctx;
    const keyTop = this.height - this.keyAreaHeight;
    const keyHeight = this.keyAreaHeight - 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, keyTop, this.width, this.keyAreaHeight);

    for (let i = 0; i < KEY_COUNT; i++) {
      const x = i * this.laneWidth + 2;
      const y = keyTop + 8;
      const w = this.keyWidth;
      const h = keyHeight;
      const pressed = this.pressedKeys.has(i);

      ctx.save();
      if (pressed) {
        ctx.shadowColor = 'rgba(255, 179, 71, 0.8)';
        ctx.shadowBlur = 25;
      }

      const gradient = ctx.createLinearGradient(x, y, x, y + h);
      if (pressed) {
        gradient.addColorStop(0, '#FFF1C8');
        gradient.addColorStop(1, '#FFD88A');
      } else {
        gradient.addColorStop(0, '#FFFEF7');
        gradient.addColorStop(0.92, '#F5F0E4');
        gradient.addColorStop(1, '#D9D0BF');
      }

      ctx.fillStyle = gradient;
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = pressed
        ? 'rgba(184, 137, 62, 0.6)'
        : 'rgba(180, 170, 150, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (pressed) {
        const topGlow = ctx.createLinearGradient(x, y - 10, x, y + 20);
        topGlow.addColorStop(0, 'rgba(255, 179, 71, 0)');
        topGlow.addColorStop(0.6, 'rgba(255, 179, 71, 0.35)');
        topGlow.addColorStop(1, 'rgba(255, 179, 71, 0)');
        ctx.fillStyle = topGlow;
        ctx.fillRect(x, y - 10, w, 30);
      }

      ctx.restore();

      const keyLabels = ['D', 'F', 'G', 'H', 'J', 'K'];
      ctx.fillStyle = pressed ? '#8F6A30' : 'rgba(44, 62, 80, 0.35)';
      ctx.font = '500 13px "Noto Sans SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(keyLabels[i], x + w / 2, y + h - 22);
    }
  }

  private renderKeyPressGlow(): void {
    const ctx = this.ctx;
    const keyTop = this.height - this.keyAreaHeight + 8;

    this.pressedKeys.forEach((keyIdx) => {
      const x = keyIdx * this.laneWidth + this.laneWidth / 2;
      const beam = ctx.createLinearGradient(x, keyTop - 250, x, keyTop + 20);
      beam.addColorStop(0, 'rgba(255, 179, 71, 0)');
      beam.addColorStop(0.6, 'rgba(255, 179, 71, 0.25)');
      beam.addColorStop(1, 'rgba(255, 179, 71, 0.55)');

      ctx.fillStyle = beam;
      ctx.fillRect(x - this.keyWidth * 0.4, keyTop - 250, this.keyWidth * 0.8, 270);
    });
  }

  private renderJudgeDisplays(): void {
    const ctx = this.ctx;
    const now = performance.now();

    const labels: Record<JudgeType, string> = {
      perfect: 'PERFECT',
      great: 'GREAT',
      good: 'GOOD',
      miss: 'MISS',
    };
    const colors: Record<JudgeType, string> = {
      perfect: '#FFD700',
      great: '#FFB347',
      good: '#8B9DC3',
      miss: '#E74C3C',
    };

    for (const jd of this.judgeDisplays) {
      const age = now - jd.createdAt;
      const t = age / 900;
      if (t >= 1) continue;

      const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
      const offset = t < 0.5
        ? -40 * (t / 0.5)
        : -40 - 40 * ((t - 0.5) / 0.5);
      const scale = 0.8 + 0.3 * (t < 0.15 ? t / 0.15 : 1);

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(jd.x, jd.y + offset);
      ctx.scale(scale, scale);

      ctx.shadowColor = colors[jd.type];
      ctx.shadowBlur = 15;

      ctx.fillStyle = colors[jd.type];
      ctx.font = '700 22px "Noto Sans SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[jd.type], 0, 0);

      ctx.restore();
    }
  }

  private renderCountdown(): void {
    if (this.status !== 'countdown') return;

    const ctx = this.ctx;
    const display = this.countdown > 0 ? String(this.countdown) : 'GO!';
    const t = 1 - (-(this.currentTime + 1000) % 1000) / 1000;
    const clamped = Math.max(0, Math.min(1, t));

    ctx.save();
    ctx.globalAlpha = 1 - clamped * 0.6;
    const scale = 1 + clamped * 0.4;
    ctx.translate(this.width / 2, this.height * 0.42);
    ctx.scale(scale, scale);

    ctx.shadowColor = 'rgba(255, 179, 71, 0.8)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = this.countdown > 0 ? '#FFB347' : '#FFD700';
    ctx.font = '700 96px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(display, 0, 0);

    ctx.restore();
  }
}
