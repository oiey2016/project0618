import { create } from 'zustand';
import {
  GameState,
  GameStatus,
  Note,
  HitEffect,
  Particle,
  SongData,
  JudgementType
} from '@/game/types';
import { GAME_CONFIG, getJudgement, getScore } from '@/game/config';
import { generateId, normalizeAngle, angleDiff, degToRad } from '@/utils/math';

interface GameStore extends GameState {
  song: SongData | null;
  noteIndex: number;

  setSong: (song: SongData) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  setPointerAngle: (angle: number) => void;
  update: (deltaTime: number) => void;

  spawnNote: (angle: number, type: Note['type']) => void;
  checkHit: () => void;
  addHitEffect: (angle: number, type: JudgementType) => void;
  addParticles: (x: number, y: number, color: string, count: number) => void;
}

const initialState: GameState = {
  status: 'menu',
  score: 0,
  combo: 0,
  maxCombo: 0,
  health: GAME_CONFIG.maxHealth,
  maxHealth: GAME_CONFIG.maxHealth,
  pointerAngle: 0,
  targetPointerAngle: 0,
  notes: [],
  hitEffects: [],
  particles: [],
  perfectCount: 0,
  greatCount: 0,
  goodCount: 0,
  missCount: 0,
  startTime: 0,
  currentTime: 0,
  songDuration: 0,
  calibrationOffset: 0,
  sensitivity: GAME_CONFIG.defaultSensitivity,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  song: null,
  noteIndex: 0,

  setSong: (song: SongData) => {
    set({ song, songDuration: song.duration });
  },

  startGame: () => {
    const state = get();
    set({
      status: 'playing',
      score: 0,
      combo: 0,
      maxCombo: 0,
      health: GAME_CONFIG.maxHealth,
      notes: [],
      hitEffects: [],
      particles: [],
      perfectCount: 0,
      greatCount: 0,
      goodCount: 0,
      missCount: 0,
      startTime: performance.now(),
      currentTime: 0,
      noteIndex: 0,
    });
  },

  pauseGame: () => {
    set({ status: 'paused' });
  },

  resumeGame: () => {
    set({ status: 'playing' });
  },

  endGame: () => {
    set({ status: 'ended' });
  },

  resetGame: () => {
    set({
      ...initialState,
      song: get().song,
      songDuration: get().song?.duration || 0,
    });
  },

  setPointerAngle: (angle: number) => {
    set({ targetPointerAngle: normalizeAngle(angle) });
  },

  update: (deltaTime: number) => {
    const state = get();
    if (state.status !== 'playing') return;

    const now = performance.now();
    const currentTime = (now - state.startTime) / 1000;

    const smoothedAngle = state.pointerAngle +
      (state.targetPointerAngle - state.pointerAngle) * GAME_CONFIG.pointerSmoothing;

    let newNotes = [...state.notes];
    let newHitEffects = [...state.hitEffects];
    let newParticles = [...state.particles];
    let newCombo = state.combo;
    let newScore = state.score;
    let newMaxCombo = state.maxCombo;
    let newHealth = state.health;
    let perfectCount = state.perfectCount;
    let greatCount = state.greatCount;
    let goodCount = state.goodCount;
    let missCount = state.missCount;
    let noteIndex = state.noteIndex;

    if (state.song) {
      while (
        noteIndex < state.song.notes.length &&
        state.song.notes[noteIndex].time <= currentTime
      ) {
        const songNote = state.song.notes[noteIndex];
        const newNote: Note = {
          id: generateId(),
          angle: songNote.angle,
          speed: GAME_CONFIG.noteSpeed,
          spawnTime: currentTime,
          type: songNote.type,
          hit: false,
          judgement: null,
          distance: GAME_CONFIG.spawnDistance,
          size: 20,
        };
        newNotes.push(newNote);
        noteIndex++;
      }
    }

    newNotes = newNotes.map(note => {
      if (note.hit) return note;
      const newDistance = note.distance - note.speed * deltaTime;
      return { ...note, distance: newDistance };
    });

    const missNotes = newNotes.filter(
      n => !n.hit && n.distance < -GAME_CONFIG.hitRadius
    );

    if (missNotes.length > 0) {
      missCount += missNotes.length;
      newCombo = 0;
      newHealth = Math.max(0, newHealth - missNotes.length * GAME_CONFIG.judgement.miss.healthCost);

      missNotes.forEach(note => {
        newHitEffects.push({
          id: generateId(),
          angle: note.angle,
          type: 'miss',
          startTime: now,
          duration: GAME_CONFIG.hitEffectDuration,
        });
      });
    }

    newNotes = newNotes.filter(n => n.distance > -GAME_CONFIG.hitRadius - 50);

    newHitEffects = newHitEffects.filter(
      effect => now - effect.startTime < effect.duration
    );

    newParticles = newParticles
      .map(p => ({
        ...p,
        x: p.x + p.vx * deltaTime,
        y: p.y + p.vy * deltaTime,
        life: p.life - deltaTime * 1000,
      }))
      .filter(p => p.life > 0);

    if (newCombo > newMaxCombo) {
      newMaxCombo = newCombo;
    }

    if (newHealth <= 0) {
      set({ status: 'ended' });
    }

    if (state.song && currentTime >= state.song.duration) {
      set({ status: 'ended' });
    }

    set({
      pointerAngle: smoothedAngle,
      targetPointerAngle: state.targetPointerAngle,
      notes: newNotes,
      hitEffects: newHitEffects,
      particles: newParticles,
      combo: newCombo,
      score: newScore,
      maxCombo: newMaxCombo,
      health: newHealth,
      perfectCount,
      greatCount,
      goodCount,
      missCount,
      currentTime,
      noteIndex,
    });
  },

  spawnNote: (angle: number, type: Note['type']) => {
    const state = get();
    const newNote: Note = {
      id: generateId(),
      angle,
      speed: GAME_CONFIG.noteSpeed,
      spawnTime: state.currentTime,
      type,
      hit: false,
      judgement: null,
      distance: GAME_CONFIG.spawnDistance,
      size: 20,
    };
    set({ notes: [...state.notes, newNote] });
  },

  checkHit: () => {
    const state = get();
    if (state.status !== 'playing') return;

    const hitZone = GAME_CONFIG.hitRadius + 30;
    const hittableNotes = state.notes.filter(
      n => !n.hit && Math.abs(n.distance) < hitZone
    );

    if (hittableNotes.length === 0) return;

    let closestNote: Note | null = null;
    let closestDiff = Infinity;

    hittableNotes.forEach(note => {
      const diff = Math.abs(angleDiff(note.angle, state.pointerAngle));
      if (diff < closestDiff && diff < GAME_CONFIG.judgement.good.angleDiff + 10) {
        closestDiff = diff;
        closestNote = note;
      }
    });

    if (!closestNote) return;

    const diff = angleDiff(closestNote.angle, state.pointerAngle);
    const judgement = getJudgement(Math.abs(diff));

    if (judgement === 'miss') return;

    const scoreGain = getScore(judgement, state.combo);
    const newCombo = state.combo + 1;

    const noteColor = GAME_CONFIG.noteColors[closestNote.type];
    const centerX = 0;
    const centerY = 0;
    const noteX = centerX + Math.cos(degToRad(closestNote.angle)) * closestNote.distance;
    const noteY = centerY + Math.sin(degToRad(closestNote.angle)) * closestNote.distance;

    const updatedNotes = state.notes.map(n =>
      n.id === closestNote!.id ? { ...n, hit: true, judgement } : n
    );

    const newHitEffect: HitEffect = {
      id: generateId(),
      angle: closestNote.angle,
      type: judgement,
      startTime: performance.now(),
      duration: GAME_CONFIG.hitEffectDuration,
    };

    const newParticles: Particle[] = [];
    for (let i = 0; i < GAME_CONFIG.particleCount; i++) {
      const angle = (i / GAME_CONFIG.particleCount) * Math.PI * 2 + Math.random() * 0.5;
      const speed = GAME_CONFIG.particleSpeed * (0.5 + Math.random() * 0.5);
      newParticles.push({
        id: generateId(),
        x: noteX,
        y: noteY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: noteColor,
        size: 3 + Math.random() * 4,
        life: GAME_CONFIG.particleLife,
        maxLife: GAME_CONFIG.particleLife,
      });
    }

    set({
      notes: updatedNotes,
      score: state.score + scoreGain,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      hitEffects: [...state.hitEffects, newHitEffect],
      particles: [...state.particles, ...newParticles],
      perfectCount: state.perfectCount + (judgement === 'perfect' ? 1 : 0),
      greatCount: state.greatCount + (judgement === 'great' ? 1 : 0),
      goodCount: state.goodCount + (judgement === 'good' ? 1 : 0),
    });
  },

  addHitEffect: (angle: number, type: JudgementType) => {
    const state = get();
    const effect: HitEffect = {
      id: generateId(),
      angle,
      type,
      startTime: performance.now(),
      duration: GAME_CONFIG.hitEffectDuration,
    };
    set({ hitEffects: [...state.hitEffects, effect] });
  },

  addParticles: (x: number, y: number, color: string, count: number) => {
    const state = get();
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      newParticles.push({
        id: generateId(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        life: 500 + Math.random() * 300,
        maxLife: 800,
      });
    }
    set({ particles: [...state.particles, ...newParticles] });
  },
}));
