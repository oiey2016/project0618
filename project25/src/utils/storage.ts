import { GameState, StarsCount } from '@/types';

const STORAGE_KEY = 'soft-dango-adventure:save';

export interface SaveData {
  unlockedLevels: number[];
  levelStars: Record<number, StarsCount>;
}

const defaultSave: SaveData = {
  unlockedLevels: [1],
  levelStars: {},
};

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSave };
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed.unlockedLevels || parsed.unlockedLevels.length === 0) {
      parsed.unlockedLevels = [1];
    }
    if (!parsed.levelStars) {
      parsed.levelStars = {};
    }
    return parsed;
  } catch {
    return { ...defaultSave };
  }
}

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function updateProgressFromState(state: GameState): SaveData {
  const save = loadSave();
  save.unlockedLevels = [...state.unlockedLevels];
  save.levelStars = { ...state.levelStars };
  saveGame(save);
  return save;
}
