import type { OreType } from '@/types/game';

export const ORES: OreType[] = [
  {
    id: 'stone',
    name: '石头',
    emoji: '🪨',
    baseValue: 1,
    unlockDepth: 1,
    color: '#9E9E9E',
  },
  {
    id: 'coal',
    name: '煤炭',
    emoji: '⬛',
    baseValue: 5,
    unlockDepth: 2,
    color: '#424242',
  },
  {
    id: 'copper',
    name: '铜矿',
    emoji: '🟤',
    baseValue: 15,
    unlockDepth: 3,
    color: '#B87333',
  },
  {
    id: 'iron',
    name: '铁矿',
    emoji: '⚙️',
    baseValue: 40,
    unlockDepth: 5,
    color: '#757575',
  },
  {
    id: 'silver',
    name: '银矿',
    emoji: '⬜',
    baseValue: 100,
    unlockDepth: 8,
    color: '#C0C0C0',
  },
  {
    id: 'gold',
    name: '金矿',
    emoji: '🟡',
    baseValue: 250,
    unlockDepth: 12,
    color: '#FFD700',
  },
  {
    id: 'diamond',
    name: '钻石',
    emoji: '💎',
    baseValue: 1000,
    unlockDepth: 20,
    color: '#00BCD4',
  },
  {
    id: 'ruby',
    name: '红宝石',
    emoji: '❤️',
    baseValue: 3000,
    unlockDepth: 30,
    color: '#E91E63',
  },
  {
    id: 'emerald',
    name: '祖母绿',
    emoji: '💚',
    baseValue: 8000,
    unlockDepth: 45,
    color: '#4CAF50',
  },
  {
    id: 'mythril',
    name: '秘银',
    emoji: '✨',
    baseValue: 25000,
    unlockDepth: 65,
    color: '#9C27B0',
  },
];

export const getOreById = (id: string): OreType | undefined => {
  return ORES.find((ore) => ore.id === id);
};

export const getAvailableOres = (depth: number): OreType[] => {
  return ORES.filter((ore) => ore.unlockDepth <= depth);
};

export const getCurrentOre = (depth: number): OreType => {
  const available = getAvailableOres(depth);
  return available[available.length - 1] || ORES[0];
};
