import type { GameState } from '@/types/game';

const STORAGE_KEY = 'mining_tycoon_save';

export const saveGame = (state: Partial<GameState>): void => {
  try {
    const saveData = {
      ...state,
      lastOnlineTime: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): Partial<GameState> | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

export const clearGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game:', error);
  }
};

export const getLastOnlineTime = (): number | null => {
  const saved = loadGame();
  return saved?.lastOnlineTime || null;
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const debouncedSave = (state: Partial<GameState>, delay = 1000): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveGame(state);
  }, delay);
};
