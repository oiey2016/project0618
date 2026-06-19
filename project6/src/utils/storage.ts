import type { GameState } from '@/types/game';

const STORAGE_KEY = 'cosmic_signal_save';

export const saveGame = (state: Partial<GameState>): void => {
  try {
    const data = {
      ...state,
      lastSaveTime: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
};

export const loadGame = (): Partial<GameState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<GameState>;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
};

export const hasSave = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

export const clearSave = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
