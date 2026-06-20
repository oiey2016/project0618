import { create } from 'zustand';
import { GameState, BlockType, PlacedBlock, StarsCount } from '@/types';
import { loadSave, updateProgressFromState } from '@/utils/storage';
import { LEVELS } from '@/data/levels';

const initialSave = loadSave();

interface GameStore extends GameState {
  setCurrentLevel: (id: number | null) => void;
  setSimulating: (val: boolean) => void;
  setPaused: (val: boolean) => void;
  setSelectedBlock: (type: BlockType | null) => void;
  addBlock: (block: PlacedBlock) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<PlacedBlock>) => void;
  clearBlocks: () => void;
  setGameResult: (result: 'success' | 'fail' | null, stars?: StarsCount) => void;
  unlockNextLevel: (currentId: number, stars: StarsCount) => void;
  resetLevelState: () => void;
  getRemainingBlocks: () => Partial<Record<BlockType, number>>;
}

export const useGameStore = create<GameStore>((set, get) => {
  const getAvailableForLevel = (): Partial<Record<BlockType, number>> => {
    const state = get();
    if (state.currentLevelId == null) return {};
    const level = LEVELS.find(l => l.id === state.currentLevelId);
    if (!level) return {};
    return { ...level.availableBlocks };
  };

  return {
    currentLevelId: null,
    unlockedLevels: initialSave.unlockedLevels,
    levelStars: initialSave.levelStars,
    isSimulating: false,
    isPaused: false,
    placedBlocks: [],
    selectedBlockType: null,
    gameResult: null,
    earnedStars: 0,

    setCurrentLevel: (id) => set({
      currentLevelId: id,
      placedBlocks: [],
      selectedBlockType: null,
      isSimulating: false,
      isPaused: false,
      gameResult: null,
      earnedStars: 0,
    }),

    setSimulating: (val) => set({ isSimulating: val }),
    setPaused: (val) => set({ isPaused: val }),
    setSelectedBlock: (type) => set({ selectedBlockType: type }),

    addBlock: (block) => set((s) => ({
      placedBlocks: [...s.placedBlocks, block],
    })),

    removeBlock: (id) => set((s) => ({
      placedBlocks: s.placedBlocks.filter(b => b.id !== id),
    })),

    updateBlock: (id, updates) => set((s) => ({
      placedBlocks: s.placedBlocks.map(b =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),

    clearBlocks: () => set({ placedBlocks: [] }),

    setGameResult: (result, stars = 0) => set({
      gameResult: result,
      earnedStars: stars,
    }),

    unlockNextLevel: (currentId, stars) => set((s) => {
      const newUnlocked = [...s.unlockedLevels];
      const nextId = currentId + 1;
      if (LEVELS.some(l => l.id === nextId) && !newUnlocked.includes(nextId)) {
        newUnlocked.push(nextId);
      }
      const newStars = { ...s.levelStars };
      if (!newStars[currentId] || newStars[currentId] < stars) {
        newStars[currentId] = stars;
      }
      const newState = {
        unlockedLevels: newUnlocked,
        levelStars: newStars,
      };
      updateProgressFromState({ ...s, ...newState });
      return newState;
    }),

    resetLevelState: () => set({
      placedBlocks: [],
      selectedBlockType: null,
      isSimulating: false,
      isPaused: false,
      gameResult: null,
      earnedStars: 0,
    }),

    getRemainingBlocks: () => {
      const available = getAvailableForLevel();
      const state = get();
      const used: Record<string, number> = {};
      for (const b of state.placedBlocks) {
        used[b.type] = (used[b.type] || 0) + 1;
      }
      const result: Partial<Record<BlockType, number>> = {};
      for (const [type, count] of Object.entries(available)) {
        const t = type as BlockType;
        result[t] = (count || 0) - (used[t] || 0);
      }
      return result;
    },
  };
});
