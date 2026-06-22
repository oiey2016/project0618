import { create } from 'zustand';
import type { SaveData, SongProgress } from '@/types';
import { loadSave, saveSave, createInitialSave } from '@/utils/saveManager';
import { SONGS } from '@/data/songs';

interface SaveStore {
  saveData: SaveData;
  initialize: () => void;
  getSongProgress: (songId: string) => SongProgress;
  updateSongProgress: (songId: string, updates: Partial<SongProgress>) => void;
  completeSong: (songId: string, score: number, rank: 'S' | 'A' | 'B' | 'C') => void;
  unlockNextSong: (currentSongId: string) => void;
  updateSettings: (settings: Partial<SaveData['settings']>) => void;
  addPlayTime: (ms: number) => void;
  resetProgress: () => void;
  isAllCompleted: () => boolean;
  getTotalScore: () => number;
}

export const useSaveStore = create<SaveStore>((set, get) => ({
  saveData: createInitialSave(),

  initialize: () => {
    const data = loadSave();
    set({ saveData: data });
  },

  getSongProgress: (songId: string) => {
    return get().saveData.songs[songId] || {
      unlocked: false,
      bestScore: 0,
      bestRank: null,
      completed: false,
      playCount: 0,
    };
  },

  updateSongProgress: (songId: string, updates: Partial<SongProgress>) => {
    set((state) => {
      const newData: SaveData = {
        ...state.saveData,
        songs: {
          ...state.saveData.songs,
          [songId]: {
            ...(state.saveData.songs[songId] || {
              unlocked: false,
              bestScore: 0,
              bestRank: null,
              completed: false,
              playCount: 0,
            }),
            ...updates,
          },
        },
      };
      saveSave(newData);
      return { saveData: newData };
    });
  },

  completeSong: (songId: string, score: number, rank: 'S' | 'A' | 'B' | 'C') => {
    set((state) => {
      const current = state.saveData.songs[songId] || {
        unlocked: false,
        bestScore: 0,
        bestRank: null,
        completed: false,
        playCount: 0,
      };
      const newProgress: SongProgress = {
        ...current,
        bestScore: Math.max(current.bestScore, score),
        bestRank: rank || current.bestRank,
        completed: true,
        playCount: current.playCount + 1,
      };
      const newData: SaveData = {
        ...state.saveData,
        songs: {
          ...state.saveData.songs,
          [songId]: newProgress,
        },
      };
      saveSave(newData);
      return { saveData: newData };
    });
  },

  unlockNextSong: (currentSongId: string) => {
    const idx = SONGS.findIndex((s) => s.id === currentSongId);
    if (idx < 0 || idx >= SONGS.length - 1) return;
    const nextSongId = SONGS[idx + 1].id;
    set((state) => {
      const current = state.saveData.songs[nextSongId] || {
        unlocked: false,
        bestScore: 0,
        bestRank: null,
        completed: false,
        playCount: 0,
      };
      if (current.unlocked) return state;
      const newData: SaveData = {
        ...state.saveData,
        songs: {
          ...state.saveData.songs,
          [nextSongId]: {
            ...current,
            unlocked: true,
          },
        },
      };
      saveSave(newData);
      return { saveData: newData };
    });
  },

  updateSettings: (settings: Partial<SaveData['settings']>) => {
    set((state) => {
      const newData: SaveData = {
        ...state.saveData,
        settings: {
          ...state.saveData.settings,
          ...settings,
        },
      };
      saveSave(newData);
      return { saveData: newData };
    });
  },

  addPlayTime: (ms: number) => {
    set((state) => {
      const newData: SaveData = {
        ...state.saveData,
        totalPlayTime: state.saveData.totalPlayTime + ms,
      };
      saveSave(newData);
      return { saveData: newData };
    });
  },

  resetProgress: () => {
    const initial = createInitialSave();
    saveSave(initial);
    set({ saveData: initial });
  },

  isAllCompleted: () => {
    const songs = get().saveData.songs;
    return Object.values(songs).every((s) => s.completed);
  },

  getTotalScore: () => {
    const songs = get().saveData.songs;
    return Object.values(songs).reduce((sum, s) => sum + s.bestScore, 0);
  },
}));
