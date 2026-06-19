import type { GameState } from '@/types';

const STORAGE_KEY = 'creator_game_state_v1';

export const saveGame = (state: GameState): void => {
  try {
    const stateToSave = {
      ...state,
      entities: state.entities.map(e => ({ ...e, isDragging: false, isNew: false })),
      lastSaveTime: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved) as GameState;
    return parsed;
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

export const getInitialState = (): GameState => {
  const saved = loadGame();
  if (saved) {
    return {
      ...saved,
      entities: saved.entities.map(e => ({ ...e, isDragging: false, isNew: false })),
    };
  }
  
  return {
    entities: [],
    unlockedSpecies: [],
    currentStage: 1,
    totalMerges: 0,
    highestLevel: 0,
    lastSaveTime: Date.now(),
    isFirstPlay: true,
  };
};
