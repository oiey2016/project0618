import { create } from 'zustand';
import type { GameState } from '../game/types';
import { getInitialState, STORAGE_KEY } from '../game/config';
import {
  recalculateStats,
  buyUpgrade,
  checkStageAdvancement,
  checkAchievements,
  getAchievementReward,
  calculateOfflineEarnings,
} from '../game/logic';
import { debounce } from '../game/utils';

interface GameStore {
  state: GameState;
  notification: { id: string; message: string; type: 'achievement' | 'stage' | 'offline' } | null;
  
  click: () => void;
  tick: (deltaTime: number) => void;
  purchaseUpgrade: (upgradeId: string) => boolean;
  loadGame: () => void;
  resetGame: () => void;
  showNotification: (message: string, type: 'achievement' | 'stage' | 'offline') => void;
  dismissNotification: () => void;
}

const saveGame = debounce((state: GameState) => {
  try {
    const saveData = { ...state, lastSaveTime: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}, 1000);

export const useGameStore = create<GameStore>((set, get) => ({
  state: getInitialState(),
  notification: null,

  click: () => {
    set(({ state }) => {
      const eggsGained = state.eggsPerClick;
      const newState: GameState = {
        ...state,
        eggs: state.eggs + eggsGained,
        totalEggs: state.totalEggs + eggsGained,
        totalClicks: state.totalClicks + 1,
      };

      const newAchievements = checkAchievements(newState);
      if (newAchievements.length > 0) {
        let reward = 0;
        newAchievements.forEach((id) => {
          reward += getAchievementReward(id);
        });
        newState.eggs += reward;
        newState.totalEggs += reward;
        newState.achievements = [...state.achievements, ...newAchievements];
      }

      const newStage = checkStageAdvancement(newState);
      if (newStage > state.currentStage) {
        newState.currentStage = newStage;
        setTimeout(() => {
          get().showNotification(`进入新阶段！`, 'stage');
        }, 100);
      }

      if (newAchievements.length > 0) {
        setTimeout(() => {
          get().showNotification(`成就解锁！`, 'achievement');
        }, 500);
      }

      saveGame(newState);
      return { state: newState };
    });
  },

  tick: (deltaTime: number) => {
    set(({ state }) => {
      const eggsGained = state.eggsPerSecond * deltaTime;
      const newState: GameState = {
        ...state,
        eggs: state.eggs + eggsGained,
        totalEggs: state.totalEggs + eggsGained,
        playTime: state.playTime + deltaTime,
      };

      const newAchievements = checkAchievements(newState);
      if (newAchievements.length > 0) {
        let reward = 0;
        newAchievements.forEach((id) => {
          reward += getAchievementReward(id);
        });
        newState.eggs += reward;
        newState.totalEggs += reward;
        newState.achievements = [...state.achievements, ...newAchievements];
      }

      const newStage = checkStageAdvancement(newState);
      if (newStage > state.currentStage) {
        newState.currentStage = newStage;
        setTimeout(() => {
          get().showNotification(`进入新阶段！`, 'stage');
        }, 100);
      }

      if (newAchievements.length > 0) {
        setTimeout(() => {
          get().showNotification(`成就解锁！`, 'achievement');
        }, 500);
      }

      saveGame(newState);
      return { state: newState };
    });
  },

  purchaseUpgrade: (upgradeId: string): boolean => {
    const { state } = get();
    const newState = buyUpgrade(state, upgradeId);
    
    if (newState.eggs !== state.eggs) {
      const achievements = checkAchievements(newState);
      if (achievements.length > 0) {
        let reward = 0;
        achievements.forEach((id) => {
          reward += getAchievementReward(id);
        });
        newState.eggs += reward;
        newState.totalEggs += reward;
        newState.achievements = [...newState.achievements, ...achievements];
      }
      
      saveGame(newState);
      set({ state: newState });
      
      if (achievements.length > 0) {
        setTimeout(() => {
          get().showNotification(`成就解锁！`, 'achievement');
        }, 500);
      }
      
      return true;
    }
    return false;
  },

  loadGame: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedState: GameState = JSON.parse(saved);
        const currentTime = Date.now();
        const offlineSeconds = (currentTime - savedState.lastSaveTime) / 1000;
        
        if (offlineSeconds > 10) {
          const offlineEarnings = calculateOfflineEarnings(savedState, offlineSeconds);
          if (offlineEarnings > 0) {
            savedState.eggs += offlineEarnings;
            savedState.totalEggs += offlineEarnings;
            setTimeout(() => {
              get().showNotification(`离线获得 ${offlineEarnings.toLocaleString()} 枚鸡蛋！`, 'offline');
            }, 1000);
          }
        }
        
        const restoredState = recalculateStats(savedState);
        set({ state: { ...restoredState, lastSaveTime: currentTime } });
      }
    } catch (e) {
      console.error('Failed to load game:', e);
    }
  },

  resetGame: () => {
    const initialState = getInitialState();
    localStorage.removeItem(STORAGE_KEY);
    set({ state: initialState });
  },

  showNotification: (message: string, type: 'achievement' | 'stage' | 'offline') => {
    const id = Date.now().toString();
    set({ notification: { id, message, type } });
    setTimeout(() => {
      get().dismissNotification();
    }, 3000);
  },

  dismissNotification: () => {
    set({ notification: null });
  },
}));
