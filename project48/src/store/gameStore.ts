import { create } from 'zustand';
import type { GameState, GameResult, Song, Grade } from '@/types/game';

interface GameStore extends GameState {
  result: GameResult | null;
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
  setCurrentTime: (time: number) => void;
  addScore: (score: number) => void;
  addCombo: () => void;
  resetCombo: () => void;
  recordJudgment: (type: 'perfect' | 'great' | 'good' | 'miss', track: number) => void;
  updateHealth: (delta: number) => void;
  resetGame: () => void;
  setResult: (result: GameResult | null) => void;
}

const initialState: GameState = {
  score: 0,
  combo: 0,
  maxCombo: 0,
  perfect: 0,
  great: 0,
  good: 0,
  miss: 0,
  health: 100,
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  lastJudgment: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  result: null,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setPaused: (paused) => set({ isPaused: paused }),
  setCurrentTime: (time) => set({ currentTime: time }),

  addScore: (score) => {
    const { combo } = get();
    const comboBonus = 1 + Math.floor(combo / 10) * 0.1;
    set((state) => ({ score: state.score + Math.round(score * comboBonus) }));
  },

  addCombo: () => {
    set((state) => ({
      combo: state.combo + 1,
      maxCombo: Math.max(state.maxCombo, state.combo + 1),
    }));
  },

  resetCombo: () => set({ combo: 0 }),

  recordJudgment: (type, track) => {
    set((state) => {
      const newState = {
        [type]: state[type] + 1,
        lastJudgment: { type, track },
      } as Partial<GameState>;
      return newState;
    });
  },

  updateHealth: (delta) => {
    set((state) => ({
      health: Math.max(0, Math.min(100, state.health + delta)),
    }));
  },

  resetGame: () => set({ ...initialState, result: get().result }),

  setResult: (result) => set({ result }),
}));

export function calculateGrade(accuracy: number): Grade {
  if (accuracy >= 95) return 'S';
  if (accuracy >= 85) return 'A';
  if (accuracy >= 70) return 'B';
  if (accuracy >= 50) return 'C';
  return 'D';
}

export function calculateAccuracy(
  perfect: number,
  great: number,
  good: number,
  miss: number
): number {
  const total = perfect + great + good + miss;
  if (total === 0) return 0;
  const weighted = perfect * 100 + great * 70 + good * 30 + miss * 0;
  return Math.round((weighted / (total * 100)) * 100);
}

export function buildGameResult(
  song: Song,
  state: Pick<GameState, 'score' | 'maxCombo' | 'perfect' | 'great' | 'good' | 'miss'>
): GameResult {
  const accuracy = calculateAccuracy(state.perfect, state.great, state.good, state.miss);
  return {
    song,
    score: state.score,
    maxCombo: state.maxCombo,
    perfect: state.perfect,
    great: state.great,
    good: state.good,
    miss: state.miss,
    grade: calculateGrade(accuracy),
    accuracy,
  };
}
