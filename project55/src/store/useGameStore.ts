import { create } from 'zustand';
import type { GameStore, Player, Equipment, ActiveBuff, GameState } from '../types/game';
import { createInitialEquipment, getEquipmentStats, getUpgradeCost } from '../data/equipment';
import { generateMonster } from '../data/monsters';
import { getItemById } from '../data/items';
import { calculateDamage, calculateExpToNextLevel, calculateLevelUpStats, calculateMonsterDamage, calculateOfflineRewards } from '../utils/battle';
import { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage';

function createInitialPlayer(): Player {
  return {
    level: 1,
    exp: 0,
    maxExp: calculateExpToNextLevel(1),
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    critRate: 0.05,
    critDamage: 0.5,
  };
}

function createInitialState(): GameState {
  return {
    player: createInitialPlayer(),
    gold: 100,
    gems: 10,
    equipment: createInitialEquipment(),
    currentStage: 1,
    currentMonster: null,
    isAutoBattle: true,
    isPaused: true,
    battleSpeed: 1,
    inventory: [],
    activeBuffs: [],
    lastOnlineTime: Date.now(),
    totalPlayTime: 0,
    monstersKilled: 0,
    highestStage: 1,
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      autoSave: true,
    },
  };
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(state: Partial<GameState>): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    if (state.settings?.autoSave) {
      saveToStorage(state);
    }
  }, 3000);
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  getPlayerTotalStats: () => {
    const { player, equipment, activeBuffs } = get();
    const totalStats: Player = { ...player };
    
    equipment.forEach((eq) => {
      const stats = getEquipmentStats(eq);
      for (const [key, value] of Object.entries(stats)) {
        if (value !== undefined) {
          (totalStats as unknown as Record<string, number>)[key] += value;
        }
      }
    });
    
    const now = Date.now();
    activeBuffs.forEach((buff) => {
      if (buff.endTime > now) {
        const baseValue = (player as unknown as Record<string, number>)[buff.stat];
        (totalStats as unknown as Record<string, number>)[buff.stat] += baseValue * buff.value;
      }
    });
    
    return totalStats;
  },

  startBattle: () => {
    set({ isPaused: false });
    const state = get();
    if (!state.currentMonster) {
      get().spawnMonster();
    }
  },

  pauseBattle: () => {
    set({ isPaused: true });
  },

  toggleAutoBattle: () => {
    set((state) => ({ isAutoBattle: !state.isAutoBattle }));
  },

  setBattleSpeed: (speed: number) => {
    set({ battleSpeed: speed });
  },

  attack: () => {
    const state = get();
    if (!state.currentMonster) return { damage: 0, isCrit: false };
    
    const playerStats = state.getPlayerTotalStats();
    const { damage, isCrit } = calculateDamage(
      playerStats.attack,
      state.currentMonster.defense,
      playerStats.critRate,
      playerStats.critDamage
    );
    
    const newMonsterHp = Math.max(0, state.currentMonster.hp - damage);
    
    set({
      currentMonster: {
        ...state.currentMonster,
        hp: newMonsterHp,
      },
    });
    
    if (newMonsterHp <= 0) {
      get().defeatMonster();
    }
    
    return { damage, isCrit };
  },

  takeDamage: (damage: number) => {
    const state = get();
    const newHp = Math.max(0, state.player.hp - damage);
    
    set({
      player: {
        ...state.player,
        hp: newHp,
      },
    });
    
    if (newHp <= 0) {
      set({
        player: {
          ...state.player,
          hp: state.player.maxHp,
        },
        currentStage: Math.max(1, state.currentStage - 1),
        isPaused: true,
      });
      get().spawnMonster();
    }
  },

  defeatMonster: () => {
    const state = get();
    if (!state.currentMonster) return;
    
    const goldDrop = state.currentMonster.goldDrop;
    const expDrop = state.currentMonster.expDrop;
    
    set({
      gold: state.gold + goldDrop,
      monstersKilled: state.monstersKilled + 1,
      currentStage: state.currentStage + 1,
      highestStage: Math.max(state.highestStage, state.currentStage + 1),
    });
    
    get().addExp(expDrop);
    get().spawnMonster();
    
    const newState = get();
    debouncedSave(newState);
  },

  spawnMonster: () => {
    const state = get();
    const monster = generateMonster(state.currentStage);
    set({ currentMonster: monster });
  },

  upgradeEquipment: (equipmentId: string) => {
    const state = get();
    const equipment = state.equipment.find((e) => e.id === equipmentId);
    if (!equipment) return false;
    
    const cost = getUpgradeCost(equipment);
    if (state.gold < cost) return false;
    if (equipment.level >= equipment.maxLevel) return false;
    
    set({
      gold: state.gold - cost,
      equipment: state.equipment.map((e) =>
        e.id === equipmentId
          ? { ...e, level: e.level + 1 }
          : e
      ),
    });
    
    if (equipment.type === 'armor') {
      const newState = get();
      const newStats = newState.getPlayerTotalStats();
      set({
        player: {
          ...newState.player,
          maxHp: newStats.maxHp,
          hp: Math.min(newState.player.hp, newStats.maxHp),
        },
      });
    }
    
    debouncedSave(get());
    return true;
  },

  buyItem: (itemId: string) => {
    const state = get();
    const item = getItemById(itemId);
    if (!item) return false;
    if (state.gold < item.price) return false;
    
    set({
      gold: state.gold - item.price,
      inventory: state.inventory.some((i) => i.itemId === itemId)
        ? state.inventory.map((i) =>
            i.itemId === itemId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.inventory, { itemId, quantity: 1 }],
    });
    
    debouncedSave(get());
    return true;
  },

  useItem: (itemId: string) => {
    const state = get();
    const inventoryItem = state.inventory.find((i) => i.itemId === itemId);
    if (!inventoryItem || inventoryItem.quantity <= 0) return false;
    
    const item = getItemById(itemId);
    if (!item) return false;
    
    if (item.type === 'consumable' && item.effect.stat === 'hp') {
      const healAmount = item.effect.value || 0;
      set({
        player: {
          ...state.player,
          hp: Math.min(state.player.maxHp, state.player.hp + healAmount),
        },
      });
    } else if (item.type === 'buff' && item.effect.stat && item.effect.duration) {
      const newBuff: ActiveBuff = {
        itemId,
        stat: item.effect.stat,
        value: item.effect.value || 0,
        endTime: Date.now() + item.effect.duration,
      };
      set({
        activeBuffs: [...state.activeBuffs.filter((b) => b.itemId !== itemId), newBuff],
      });
    } else if (item.type === 'upgrade') {
      if (item.effect.stat === 'exp' && item.effect.value) {
        get().addExp(item.effect.value);
      } else if (item.effect.value) {
        set({ gold: state.gold + item.effect.value });
      }
    }
    
    set({
      inventory: state.inventory.map((i) =>
        i.itemId === itemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ).filter((i) => i.quantity > 0),
    });
    
    debouncedSave(get());
    return true;
  },

  addGold: (amount: number) => {
    set((state) => ({ gold: state.gold + amount }));
  },

  addExp: (amount: number) => {
    const state = get();
    let newExp = state.player.exp + amount;
    let newLevel = state.player.level;
    let newMaxExp = state.player.maxExp;
    let bonusStats = {};
    
    while (newExp >= newMaxExp) {
      newExp -= newMaxExp;
      newLevel++;
      newMaxExp = calculateExpToNextLevel(newLevel);
      bonusStats = { ...bonusStats, ...calculateLevelUpStats(newLevel) };
    }
    
    if (newLevel > state.player.level) {
      const newMaxHp = state.player.maxHp + ((bonusStats as Partial<Player>).maxHp || 0);
      set({
        player: {
          ...state.player,
          level: newLevel,
          exp: newExp,
          maxExp: newMaxExp,
          maxHp: newMaxHp,
          hp: newMaxHp,
          attack: state.player.attack + ((bonusStats as Partial<Player>).attack || 0),
          defense: state.player.defense + ((bonusStats as Partial<Player>).defense || 0),
        },
      });
    } else {
      set({
        player: {
          ...state.player,
          exp: newExp,
        },
      });
    }
  },

  levelUp: () => {
    const state = get();
    if (state.player.exp < state.player.maxExp) return;
    
    const newLevel = state.player.level + 1;
    const bonusStats = calculateLevelUpStats(newLevel);
    const newMaxHp = state.player.maxHp + (bonusStats.maxHp || 0);
    
    set({
      player: {
        ...state.player,
        level: newLevel,
        exp: state.player.exp - state.player.maxExp,
        maxExp: calculateExpToNextLevel(newLevel),
        maxHp: newMaxHp,
        hp: newMaxHp,
        attack: state.player.attack + (bonusStats.attack || 0),
        defense: state.player.defense + (bonusStats.defense || 0),
      },
    });
    
    debouncedSave(get());
  },

  healPlayer: (amount: number) => {
    const state = get();
    set({
      player: {
        ...state.player,
        hp: Math.min(state.player.maxHp, state.player.hp + amount),
      },
    });
  },

  saveGame: () => {
    const state = get();
    saveToStorage(state);
  },

  loadGame: () => {
    const saved = loadFromStorage<GameState>();
    if (saved) {
      set({
        ...saved,
        isPaused: true,
        currentMonster: null,
      });
      return true;
    }
    return false;
  },

  resetGame: () => {
    clearStorage();
    set({
      ...createInitialState(),
    });
  },

  calculateOfflineRewards: () => {
    const state = get();
    const now = Date.now();
    const offlineMs = now - state.lastOnlineTime;
    
    if (offlineMs < 60000) {
      return { gold: 0, exp: 0, time: 0 };
    }
    
    const avgGoldPerSecond = state.monstersKilled > 0
      ? (state.gold / state.monstersKilled) * 0.5
      : 5;
    const avgExpPerSecond = state.monstersKilled > 0
      ? (state.player.level * 10 / state.monstersKilled) * 0.5
      : 2;
    
    const rewards = calculateOfflineRewards(offlineMs, avgGoldPerSecond, avgExpPerSecond);
    
    return {
      gold: rewards.gold,
      exp: rewards.exp,
      time: offlineMs,
    };
  },

  claimOfflineRewards: () => {
    const rewards = get().calculateOfflineRewards();
    if (rewards.gold > 0 || rewards.exp > 0) {
      set((state) => ({
        gold: state.gold + rewards.gold,
        lastOnlineTime: Date.now(),
      }));
      get().addExp(rewards.exp);
      debouncedSave(get());
    }
    return { gold: rewards.gold, exp: rewards.exp };
  },

  updateLastOnlineTime: () => {
    set({ lastOnlineTime: Date.now() });
  },

  toggleSound: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        soundEnabled: !state.settings.soundEnabled,
      },
    }));
  },

  toggleVibration: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        vibrationEnabled: !state.settings.vibrationEnabled,
      },
    }));
  },
}));
