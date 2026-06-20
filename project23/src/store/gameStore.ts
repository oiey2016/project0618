import { create } from 'zustand'

interface SpawnedItem {
  id: string
  name: string
  x: number
  y: number
}

type GamePhase = 'menu' | 'playing' | 'paused' | 'won' | 'lost'

interface GameStore {
  currentLevel: number
  gamePhase: GamePhase
  spawnedItems: SpawnedItem[]
  timeElapsed: number
  completedLevels: Record<number, { stars: number; time: number }>
  actions: {
    spawnItem: (item: SpawnedItem) => void
    removeItem: (id: string) => void
    setPhase: (phase: GamePhase) => void
    completeLevel: (levelId: number, stars: number, time: number) => void
    resetLevel: () => void
    setTime: (time: number) => void
    setCurrentLevel: (level: number) => void
  }
}

export const useGameStore = create<GameStore>((set) => ({
  currentLevel: 1,
  gamePhase: 'menu',
  spawnedItems: [],
  timeElapsed: 0,
  completedLevels: {},
  actions: {
    spawnItem: (item) =>
      set((state) => ({ spawnedItems: [...state.spawnedItems, item] })),
    removeItem: (id) =>
      set((state) => ({
        spawnedItems: state.spawnedItems.filter((item) => item.id !== id),
      })),
    setPhase: (phase) => set({ gamePhase: phase }),
    completeLevel: (levelId, stars, time) =>
      set((state) => ({
        completedLevels: { ...state.completedLevels, [levelId]: { stars, time } },
        gamePhase: 'won',
      })),
    resetLevel: () =>
      set({ spawnedItems: [], timeElapsed: 0, gamePhase: 'playing' }),
    setTime: (time) => set({ timeElapsed: time }),
    setCurrentLevel: (level) =>
      set({ currentLevel: level, spawnedItems: [], timeElapsed: 0, gamePhase: 'playing' }),
  },
}))
