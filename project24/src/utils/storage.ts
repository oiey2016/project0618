import { GameState } from '@/types';

const STORAGE_KEY = 'pixel_puzzle_game_state';

const defaultGameState: GameState = {
  currentLevel: 1,
  completedLevels: {},
  soundEnabled: true,
};

export const loadGameState = (): GameState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return { ...defaultGameState };
};

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const resetGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset game state:', error);
  }
};
