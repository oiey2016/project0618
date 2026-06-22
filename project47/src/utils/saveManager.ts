import type { SaveData, SongProgress, Rank } from '@/types';
import { SONGS } from '@/data/songs';

const SAVE_KEY = 'melody-tale-save-v1';

const DEFAULT_PROGRESS: SongProgress = {
  unlocked: false,
  bestScore: 0,
  bestRank: null,
  completed: false,
  playCount: 0,
};

const DEFAULT_SAVE: SaveData = {
  version: '1.0.0',
  songs: {},
  settings: {
    volume: 0.8,
    noteSpeed: 1.0,
  },
  totalPlayTime: 0,
};

export function createInitialSave(): SaveData {
  const songs: Record<string, SongProgress> = {};
  SONGS.forEach((song, index) => {
    songs[song.id] = {
      ...DEFAULT_PROGRESS,
      unlocked: index === 0,
    };
  });
  return { ...DEFAULT_SAVE, songs };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      const initial = createInitialSave();
      saveSave(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed.songs || Object.keys(parsed.songs).length === 0) {
      const initial = createInitialSave();
      saveSave(initial);
      return initial;
    }
    SONGS.forEach((song, index) => {
      if (!parsed.songs[song.id]) {
        parsed.songs[song.id] = {
          ...DEFAULT_PROGRESS,
          unlocked: index === 0,
        };
      }
    });
    return parsed;
  } catch {
    const initial = createInitialSave();
    saveSave(initial);
    return initial;
  }
}

export function saveSave(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function resetSave(): SaveData {
  const initial = createInitialSave();
  saveSave(initial);
  return initial;
}

export function calculateRank(score: number, maxScore: number): Rank {
  const ratio = maxScore > 0 ? score / maxScore : 0;
  if (ratio >= 0.95) return 'S';
  if (ratio >= 0.85) return 'A';
  if (ratio >= 0.70) return 'B';
  if (ratio >= 0.50) return 'C';
  return 'C';
}

export function getMaxScore(noteCount: number): number {
  return noteCount * 100;
}
