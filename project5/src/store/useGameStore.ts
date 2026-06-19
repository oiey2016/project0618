import { create } from 'zustand';
import type { GameState, LifeEntity, ToastMessage, Particle } from '@/types';
import { getInitialState, saveGame, clearGame } from '@/utils/storage';
import { createEntity, mergeEntities, cleanUpEntities, getRandomPosition } from '@/utils/mergeLogic';
import { getStageByLevel, SPECIES, AUTO_SAVE_INTERVAL } from '@/data/evolutionTree';

interface GameActions {
  spawnEntity: (x: number, y: number) => void;
  updateEntityPosition: (id: string, x: number, y: number) => void;
  setEntityDragging: (id: string, isDragging: boolean) => void;
  tryMerge: (entity1Id: string, entity2Id: string) => void;
  unlockSpecies: (level: number) => boolean;
  updateStage: (newHighestLevel: number) => void;
  addToast: (message: string, emoji: string, isMiracle?: boolean) => void;
  removeToast: (id: string) => void;
  addParticles: (x: number, y: number, color: string, count?: number) => void;
  removeParticle: (id: string) => void;
  clearEntityNewFlag: (id: string) => void;
  resetGame: () => void;
  autoSave: () => void;
  completeFirstPlay: () => void;
}

interface ToastState {
  toasts: ToastMessage[];
  particles: Particle[];
}

export const useGameStore = create<GameState & GameActions & ToastState>((set, get) => ({
  ...getInitialState(),
  toasts: [],
  particles: [],

  spawnEntity: (x: number, y: number) => {
    const entity = createEntity(1, x, y, true);
    if (!entity) return;

    set(state => {
      let newEntities = [...state.entities, entity];
      newEntities = cleanUpEntities(newEntities);
      
      const isUnlocked = state.unlockedSpecies.includes(1);
      let newUnlocked = state.unlockedSpecies;
      if (!isUnlocked) {
        newUnlocked = [...state.unlockedSpecies, 1];
      }

      let newHighest = state.highestLevel;
      let newStage = state.currentStage;
      if (1 > state.highestLevel) {
        newHighest = 1;
        const stage = getStageByLevel(1);
        newStage = stage.id;
      }

      return {
        entities: newEntities,
        unlockedSpecies: newUnlocked,
        highestLevel: newHighest,
        currentStage: newStage,
      };
    });
  },

  updateEntityPosition: (id: string, x: number, y: number) => {
    set(state => ({
      entities: state.entities.map(e =>
        e.id === id ? { ...e, x, y } : e
      ),
    }));
  },

  setEntityDragging: (id: string, isDragging: boolean) => {
    set(state => ({
      entities: state.entities.map(e =>
        e.id === id ? { ...e, isDragging } : e
      ),
    }));
  },

  tryMerge: (entity1Id: string, entity2Id: string) => {
    const state = get();
    const result = mergeEntities(state.entities, entity1Id, entity2Id);

    if (!result.mergedEntity) return;

    const { newEntities, mergedEntity, isMiracle } = result;
    const cleanedEntities = cleanUpEntities(newEntities);

    const isNewSpecies = !state.unlockedSpecies.includes(mergedEntity.level);
    let newUnlocked = state.unlockedSpecies;
    let newHighest = state.highestLevel;
    let newStage = state.currentStage;

    if (isNewSpecies) {
      newUnlocked = [...state.unlockedSpecies, mergedEntity.level];
      
      const species = SPECIES.find(s => s.level === mergedEntity.level);
      if (species) {
        if (isMiracle) {
          get().addToast(`✨ 奇迹！${species.name} 跨越进化！`, species.emoji, true);
        } else {
          get().addToast(`🎉 解锁新物种：${species.name}`, species.emoji);
        }
      }
    }

    if (mergedEntity.level > state.highestLevel) {
      newHighest = mergedEntity.level;
      const stage = getStageByLevel(mergedEntity.level);
      if (stage.id > state.currentStage) {
        newStage = stage.id;
        get().addToast(`🌟 进入新阶段：${stage.name}`, '🌟');
      }
    }

    get().addParticles(
      mergedEntity.x,
      mergedEntity.y,
      isMiracle ? '#fbbf24' : '#10b981',
      isMiracle ? 15 : 8
    );

    set({
      entities: cleanedEntities,
      unlockedSpecies: newUnlocked,
      totalMerges: state.totalMerges + 1,
      highestLevel: newHighest,
      currentStage: newStage,
    });
  },

  unlockSpecies: (level: number) => {
    const state = get();
    if (state.unlockedSpecies.includes(level)) return false;
    
    set({
      unlockedSpecies: [...state.unlockedSpecies, level],
    });
    return true;
  },

  updateStage: (newHighestLevel: number) => {
    const stage = getStageByLevel(newHighestLevel);
    set({ currentStage: stage.id });
  },

  addToast: (message: string, emoji: string, isMiracle: boolean = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    set(state => ({
      toasts: [...state.toasts, { id, message, emoji, isMiracle }],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 2500);
  },

  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  addParticles: (x: number, y: number, color: string, count: number = 8) => {
    const newParticles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 40;
      return {
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        color,
        size: 4 + Math.random() * 8,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
      };
    });

    set(state => ({
      particles: [...state.particles, ...newParticles],
    }));

    setTimeout(() => {
      newParticles.forEach(p => get().removeParticle(p.id));
    }, 1000);
  },

  removeParticle: (id: string) => {
    set(state => ({
      particles: state.particles.filter(p => p.id !== id),
    }));
  },

  clearEntityNewFlag: (id: string) => {
    set(state => ({
      entities: state.entities.map(e =>
        e.id === id ? { ...e, isNew: false } : e
      ),
    }));
  },

  resetGame: () => {
    clearGame();
    set({
      entities: [],
      unlockedSpecies: [],
      currentStage: 1,
      totalMerges: 0,
      highestLevel: 0,
      lastSaveTime: Date.now(),
      isFirstPlay: true,
      toasts: [],
      particles: [],
    });
  },

  autoSave: () => {
    const state = get();
    saveGame({
      entities: state.entities,
      unlockedSpecies: state.unlockedSpecies,
      currentStage: state.currentStage,
      totalMerges: state.totalMerges,
      highestLevel: state.highestLevel,
      lastSaveTime: Date.now(),
      isFirstPlay: state.isFirstPlay,
    });
  },

  completeFirstPlay: () => {
    set({ isFirstPlay: false });
  },
}));

let autoSaveInterval: number | null = null;

export const startAutoSave = () => {
  if (autoSaveInterval) return;
  autoSaveInterval = window.setInterval(() => {
    useGameStore.getState().autoSave();
  }, AUTO_SAVE_INTERVAL);
};

export const stopAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
};
