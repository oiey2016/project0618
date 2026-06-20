import { create } from 'zustand';
import { GameState } from '@/types';
import { loadGameState, saveGameState, resetGameState } from '@/utils/storage';

interface GameStore extends GameState {
  setSoundEnabled: (enabled: boolean) => void;
  completeLevel: (levelId: number, stars: number, time: number) => void;
  setCurrentLevel: (levelId: number) => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...loadGameState(),

  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled });
    saveGameState(get());
  },

  completeLevel: (levelId: number, stars: number, time: number) => {
    set(state => {
      const existing = state.completedLevels[levelId];
      const newStars = existing ? Math.max(existing.stars, stars) : stars;
      const newTime = existing ? Math.min(existing.time, time) : time;
      
      const newState = {
        ...state,
        completedLevels: {
          ...state.completedLevels,
          [levelId]: { stars: newStars, time: newTime },
        },
        currentLevel: levelId + 1,
      };
      saveGameState(newState);
      return newState;
    });
  },

  setCurrentLevel: (levelId: number) => {
    set({ currentLevel: levelId });
    saveGameState(get());
  },

  resetProgress: () => {
    resetGameState();
    set({
      currentLevel: 1,
      completedLevels: {},
      soundEnabled: true,
    });
  },
}));
