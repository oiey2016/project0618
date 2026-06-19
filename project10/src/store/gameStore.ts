import { create } from 'zustand'

interface GameState {
  currentPhase: 'suspicion' | 'evidence' | 'deduction'
  suspicions: Record<string, boolean>
  evidences: Record<string, boolean>
  unlockedNotes: Record<string, boolean>
  chatProgress: Record<string, string>
  selectedKiller: string | null
  selectedMotive: string | null
  gameCompleted: boolean
  showSuspicionPopup: { id: string; message: string } | null

  discoverSuspicion: (id: string, message: string) => void
  collectEvidence: (id: string) => void
  unlockNote: (id: string) => void
  advanceChat: (characterId: string, groupId: string) => void
  setDeduction: (killer: string, motive: string) => void
  completeGame: () => void
  dismissSuspicionPopup: () => void
  resetGame: () => void
  getDiscoveredSuspicionCount: () => number
  getCollectedEvidenceCount: () => number
  canDeduce: () => boolean
}

const initialState = {
  currentPhase: 'suspicion' as const,
  suspicions: {} as Record<string, boolean>,
  evidences: {} as Record<string, boolean>,
  unlockedNotes: {
    'note-lin-1': true,
    'note-zhao-1': true,
    'note-su-1': true,
    'note-chen-1': true,
    'note-zhou-1': true,
  } as Record<string, boolean>,
  chatProgress: {} as Record<string, string>,
  selectedKiller: null as string | null,
  selectedMotive: null as string | null,
  gameCompleted: false,
  showSuspicionPopup: null as { id: string; message: string } | null,
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  discoverSuspicion: (id, message) =>
    set((state) => ({
      suspicions: { ...state.suspicions, [id]: true },
      showSuspicionPopup: { id, message },
    })),

  collectEvidence: (id) =>
    set((state) => {
      const newEvidences = { ...state.evidences, [id]: true }
      const evidenceCount = Object.values(newEvidences).filter(Boolean).length
      const suspicionCount = Object.values(state.suspicions).filter(Boolean).length
      let newPhase = state.currentPhase

      if (suspicionCount >= 3 && newPhase === 'suspicion') {
        newPhase = 'evidence'
      }
      if (evidenceCount >= 3 && newPhase === 'evidence') {
        newPhase = 'deduction'
      }

      return { evidences: newEvidences, currentPhase: newPhase }
    }),

  unlockNote: (id) =>
    set((state) => ({
      unlockedNotes: { ...state.unlockedNotes, [id]: true },
    })),

  advanceChat: (characterId, groupId) =>
    set((state) => ({
      chatProgress: { ...state.chatProgress, [characterId]: groupId },
    })),

  setDeduction: (killer, motive) =>
    set({ selectedKiller: killer, selectedMotive: motive }),

  completeGame: () => set({ gameCompleted: true }),

  dismissSuspicionPopup: () => set({ showSuspicionPopup: null }),

  resetGame: () => set({ ...initialState }),

  getDiscoveredSuspicionCount: () =>
    Object.values(get().suspicions).filter(Boolean).length,

  getCollectedEvidenceCount: () =>
    Object.values(get().evidences).filter(Boolean).length,

  canDeduce: () =>
    Object.values(get().suspicions).filter(Boolean).length >= 4 &&
    Object.values(get().evidences).filter(Boolean).length >= 3,
}))
