import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerData, Equipment } from '@/types';
import { getEquipmentById } from '@/data/equipment';

interface PlayerStore extends PlayerData {
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addExp: (amount: number) => void;
  buyEquipment: (equipmentId: string) => boolean;
  equipItem: (equipmentId: string) => void;
  unequipItem: (type: 'weapon' | 'armor' | 'accessory') => void;
  unlockLevel: (levelId: string) => void;
  completeLevel: (levelId: string) => void;
  getTotalStats: () => { attack: number; defense: number; luck: number };
  resetGame: () => void;
}

const initialPlayerData: PlayerData = {
  name: '小探险家',
  level: 1,
  exp: 0,
  gold: 100,
  attack: 5,
  defense: 5,
  luck: 5,
  equipment: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  inventory: [],
  unlockedLevels: ['level-1'],
  completedLevels: [],
};

function getExpForLevel(level: number): number {
  return level * 50;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialPlayerData,

      addGold: (amount: number) => {
        set((state) => ({ gold: state.gold + amount }));
      },

      spendGold: (amount: number) => {
        const { gold } = get();
        if (gold >= amount) {
          set((state) => ({ gold: state.gold - amount }));
          return true;
        }
        return false;
      },

      addExp: (amount: number) => {
        set((state) => {
          let newExp = state.exp + amount;
          let newLevel = state.level;

          while (newExp >= getExpForLevel(newLevel)) {
            newExp -= getExpForLevel(newLevel);
            newLevel += 1;
          }

          return {
            exp: newExp,
            level: newLevel,
            attack: initialPlayerData.attack + (newLevel - 1) * 2,
            defense: initialPlayerData.defense + (newLevel - 1) * 2,
            luck: initialPlayerData.luck + (newLevel - 1) * 1,
          };
        });
      },

      buyEquipment: (equipmentId: string) => {
        const equipment = getEquipmentById(equipmentId);
        if (!equipment) return false;

        const { gold, inventory } = get();
        if (inventory.includes(equipmentId)) return false;
        if (gold < equipment.price) return false;

        set((state) => ({
          gold: state.gold - equipment.price,
          inventory: [...state.inventory, equipmentId],
        }));
        return true;
      },

      equipItem: (equipmentId: string) => {
        const equipment = getEquipmentById(equipmentId);
        if (!equipment) return;

        const { inventory } = get();
        if (!inventory.includes(equipmentId)) return;

        set((state) => ({
          equipment: {
            ...state.equipment,
            [equipment.type]: equipmentId,
          },
        }));
      },

      unequipItem: (type: 'weapon' | 'armor' | 'accessory') => {
        set((state) => ({
          equipment: {
            ...state.equipment,
            [type]: null,
          },
        }));
      },

      unlockLevel: (levelId: string) => {
        set((state) => {
          if (state.unlockedLevels.includes(levelId)) return state;
          return {
            unlockedLevels: [...state.unlockedLevels, levelId],
          };
        });
      },

      completeLevel: (levelId: string) => {
        set((state) => {
          if (state.completedLevels.includes(levelId)) return state;
          return {
            completedLevels: [...state.completedLevels, levelId],
          };
        });
      },

      getTotalStats: () => {
        const state = get();
        let totalAttack = state.attack;
        let totalDefense = state.defense;
        let totalLuck = state.luck;

        const equipSlots = ['weapon', 'armor', 'accessory'] as const;
        for (const slot of equipSlots) {
          const equipId = state.equipment[slot];
          if (equipId) {
            const equip = getEquipmentById(equipId);
            if (equip) {
              totalAttack += equip.stats.attack || 0;
              totalDefense += equip.stats.defense || 0;
              totalLuck += equip.stats.luck || 0;
            }
          }
        }

        return { attack: totalAttack, defense: totalDefense, luck: totalLuck };
      },

      resetGame: () => {
        set(initialPlayerData);
      },
    }),
    {
      name: 'knowledge-adventure-save',
    }
  )
);
