import { create } from 'zustand';
import type { GameState, Miner } from '@/types/game';
import {
  calculateClickValue,
  calculateOrePerSecond,
  calculateGoldPerSecond,
  calculateTotalMinerEfficiency,
  calculateLogisticsSpeed,
  calculateStorageCapacity,
  calculateAutomationRate,
  calculateOfflineEarnings,
  calculateRandomOreDrop,
} from '@/utils/calculations';
import { getMinerTypeById, getMinerCost } from '@/data/miners';
import {
  getLogisticsCost,
  getMineDepthCost,
  getMinerUpgradeCost,
  LOGISTICS_UPGRADES,
} from '@/data/upgrades';
import { getOreById, getCurrentOre } from '@/data/ores';
import { debouncedSave, loadGame } from '@/utils/storage';

interface GameStore extends GameState {
  clickMine: (x?: number, y?: number) => { oreId: string; value: number } | null;
  hireMiner: (typeId: string) => boolean;
  upgradeMiner: (minerId: string) => boolean;
  upgradeLogistics: (upgradeId: string) => boolean;
  upgradeMineDepth: () => boolean;
  collectOfflineEarnings: (earnings: number) => void;
  gameLoop: (deltaTime: number) => void;
  getOrePerSecond: () => number;
  getGoldPerSecond: () => number;
  getTotalMinerEfficiency: () => number;
  getLogisticsSpeed: () => number;
  getStorageCapacity: () => number;
  getAutomationRate: () => number;
  calculateOfflineEarnings: () => { gold: number; duration: number } | null;
  loadGameState: () => void;
  toggleSound: () => void;
  setGameSpeed: (speed: number) => void;
  resetGame: () => void;
}

const getInitialState = (): GameState => ({
  gold: 0,
  ores: { stone: 0 },
  mineDepth: 1,
  miners: [],
  logistics: {
    transport: 0,
    storage: 0,
    automation: 0,
    offline: 0,
  },
  totalEarnings: 0,
  lastOnlineTime: Date.now(),
  gameSpeed: 1,
  soundEnabled: true,
});

let minerIdCounter = 0;

const generateMinerId = (): string => {
  return `miner_${Date.now()}_${minerIdCounter++}`;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  clickMine: () => {
    const state = get();
    const value = calculateClickValue(state.mineDepth);
    const oreId = calculateRandomOreDrop(state.mineDepth);
    const ore = getOreById(oreId);
    if (!ore) return null;

    const storageCapacity = state.getStorageCapacity();
    const currentOreAmount = state.ores[oreId] || 0;
    const newAmount = Math.min(currentOreAmount + value, storageCapacity);

    set((prev) => {
      const newState = {
        ores: {
          ...prev.ores,
          [oreId]: newAmount,
        },
      };
      debouncedSave(newState);
      return newState;
    });

    return { oreId, value };
  },

  hireMiner: (typeId: string) => {
    const state = get();
    const minerType = getMinerTypeById(typeId);
    if (!minerType) return false;

    const existingMiner = state.miners.find((m) => m.typeId === typeId);
    const count = existingMiner ? existingMiner.count : 0;
    const cost = getMinerCost(minerType.baseCost, count);

    if (state.gold < cost) return false;

    set((prev) => {
      let newMiners: Miner[];
      if (existingMiner) {
        newMiners = prev.miners.map((m) =>
          m.id === existingMiner.id ? { ...m, count: m.count + 1 } : m
        );
      } else {
        newMiners = [
          ...prev.miners,
          {
            id: generateMinerId(),
            typeId,
            level: 1,
            count: 1,
          },
        ];
      }

      const newState = {
        gold: prev.gold - cost,
        miners: newMiners,
      };
      debouncedSave(newState);
      return newState;
    });

    return true;
  },

  upgradeMiner: (minerId: string) => {
    const state = get();
    const miner = state.miners.find((m) => m.id === minerId);
    if (!miner) return false;

    const minerType = getMinerTypeById(miner.typeId);
    if (!minerType) return false;

    const cost = getMinerUpgradeCost(minerType.baseCost, miner.level);
    if (state.gold < cost) return false;

    set((prev) => {
      const newState = {
        gold: prev.gold - cost,
        miners: prev.miners.map((m) =>
          m.id === minerId ? { ...m, level: m.level + 1 } : m
        ),
      };
      debouncedSave(newState);
      return newState;
    });

    return true;
  },

  upgradeLogistics: (upgradeId: string) => {
    const state = get();
    const upgrade = LOGISTICS_UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return false;

    const currentLevel = state.logistics[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return false;

    const cost = getLogisticsCost(upgrade.baseCost, currentLevel);
    if (state.gold < cost) return false;

    set((prev) => {
      const newState = {
        gold: prev.gold - cost,
        logistics: {
          ...prev.logistics,
          [upgradeId]: currentLevel + 1,
        },
      };
      debouncedSave(newState);
      return newState;
    });

    return true;
  },

  upgradeMineDepth: () => {
    const state = get();
    const cost = getMineDepthCost(state.mineDepth);

    if (state.gold < cost) return false;

    set((prev) => {
      const newDepth = prev.mineDepth + 1;
      const currentOre = getCurrentOre(newDepth);

      const newState = {
        gold: prev.gold - cost,
        mineDepth: newDepth,
        ores: {
          ...prev.ores,
          [currentOre.id]: prev.ores[currentOre.id] || 0,
        },
      };
      debouncedSave(newState);
      return newState;
    });

    return true;
  },

  collectOfflineEarnings: (earnings: number) => {
    set((prev) => {
      const newState = {
        gold: prev.gold + earnings,
        totalEarnings: prev.totalEarnings + earnings,
        lastOnlineTime: Date.now(),
      };
      debouncedSave(newState);
      return newState;
    });
  },

  gameLoop: (deltaTime: number) => {
    const state = get();
    const orePerSecond = state.getOrePerSecond();
    const goldPerSecond = state.getGoldPerSecond();
    const automationRate = state.getAutomationRate();
    const storageCapacity = state.getStorageCapacity();

    const oreToAdd = orePerSecond * deltaTime;
    const goldToAdd = goldPerSecond * deltaTime * automationRate;

    if (oreToAdd <= 0 && goldToAdd <= 0) return;

    const currentOre = getCurrentOre(state.mineDepth);

    set((prev) => {
      const currentOreAmount = prev.ores[currentOre.id] || 0;
      const newOreAmount = Math.min(currentOreAmount + oreToAdd, storageCapacity);

      const newState = {
        gold: prev.gold + goldToAdd,
        ores: {
          ...prev.ores,
          [currentOre.id]: newOreAmount,
        },
        totalEarnings: prev.totalEarnings + goldToAdd,
        lastOnlineTime: Date.now(),
      };

      return newState;
    });
  },

  getOrePerSecond: () => {
    return calculateOrePerSecond(get());
  },

  getGoldPerSecond: () => {
    return calculateGoldPerSecond(get());
  },

  getTotalMinerEfficiency: () => {
    return calculateTotalMinerEfficiency(get().miners);
  },

  getLogisticsSpeed: () => {
    return calculateLogisticsSpeed(get().logistics);
  },

  getStorageCapacity: () => {
    return calculateStorageCapacity(get().logistics);
  },

  getAutomationRate: () => {
    return calculateAutomationRate(get().logistics);
  },

  calculateOfflineEarnings: () => {
    const state = get();
    const lastOnline = state.lastOnlineTime;
    if (!lastOnline) return null;

    const offlineMs = Date.now() - lastOnline;
    if (offlineMs < 60000) return null;

    return calculateOfflineEarnings(state, offlineMs);
  },

  loadGameState: () => {
    const saved = loadGame();
    if (saved) {
      set((prev) => ({
        ...prev,
        ...saved,
        lastOnlineTime: Date.now(),
      }));
    }
  },

  toggleSound: () => {
    set((prev) => {
      const newState = { soundEnabled: !prev.soundEnabled };
      debouncedSave(newState);
      return newState;
    });
  },

  setGameSpeed: (speed: number) => {
    set({ gameSpeed: speed });
  },

  resetGame: () => {
    minerIdCounter = 0;
    set(getInitialState());
    localStorage.removeItem('mining_tycoon_save');
  },
}));
