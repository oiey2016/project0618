import { create } from 'zustand';
import { Ball, GameState } from '../types/game';
import { levels } from '../utils/levelData';

interface GameStore extends GameState {
  setCurrentLevel: (level: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  updateBall: (ball: Ball) => void;
  updateTime: (time: number) => void;
  setVictory: () => void;
  setGameOver: () => void;
  updateBestTime: (time: number) => void;
}

const getInitialBall = (levelId: number): Ball => {
  const level = levels.find(l => l.id === levelId);
  return {
    x: level?.ballStart.x || 100,
    y: level?.ballStart.y || 100,
    vx: 0,
    vy: 0,
    radius: 15,
  };
};

const getStoredBestTime = (levelId: number): number | null => {
  const stored = localStorage.getItem(`best_time_${levelId}`);
  return stored ? parseFloat(stored) : null;
};

const storeBestTime = (levelId: number, time: number): void => {
  localStorage.setItem(`best_time_${levelId}`, time.toString());
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentLevel: 1,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  isVictory: false,
  time: 0,
  bestTime: getStoredBestTime(1),
  ball: getInitialBall(1),

  setCurrentLevel: (level) => {
    set({
      currentLevel: level,
      ball: getInitialBall(level),
      time: 0,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      bestTime: getStoredBestTime(level),
    });
  },

  startGame: () => {
    set({ isPlaying: true, isPaused: false, isGameOver: false, isVictory: false, time: 0 });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  resetGame: () => {
    const { currentLevel } = get();
    set({
      ball: getInitialBall(currentLevel),
      time: 0,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
    });
  },

  updateBall: (ball) => {
    set({ ball });
  },

  updateTime: (time) => {
    set({ time });
  },

  setVictory: () => {
    const { time, currentLevel, bestTime } = get();
    if (bestTime === null || time < bestTime) {
      storeBestTime(currentLevel, time);
      set({ bestTime: time });
    }
    set({ isVictory: true, isPlaying: false });
  },

  setGameOver: () => {
    set({ isGameOver: true, isPlaying: false });
  },

  updateBestTime: (time) => {
    const { currentLevel } = get();
    storeBestTime(currentLevel, time);
    set({ bestTime: time });
  },
}));