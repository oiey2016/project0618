import type { LogisticsUpgrade } from '@/types/game';

export const LOGISTICS_UPGRADES: LogisticsUpgrade[] = [
  {
    id: 'transport',
    name: '运输速度',
    description: '提升矿石运输速度，加快金币到账',
    emoji: '🚚',
    baseCost: 50,
    effect: 0.1,
    maxLevel: 50,
  },
  {
    id: 'storage',
    name: '仓库容量',
    description: '增加矿石存储上限，防止溢出',
    emoji: '📦',
    baseCost: 100,
    effect: 0.2,
    maxLevel: 30,
  },
  {
    id: 'automation',
    name: '自动售卖',
    description: '自动将矿石转换为金币',
    emoji: '💱',
    baseCost: 500,
    effect: 0.05,
    maxLevel: 20,
  },
  {
    id: 'offline',
    name: '离线效率',
    description: '提升离线时的收益效率',
    emoji: '🌙',
    baseCost: 1000,
    effect: 0.1,
    maxLevel: 10,
  },
];

export const LOGISTICS_COST_MULTIPLIER = 1.2;

export const getLogisticsUpgradeById = (
  id: string
): LogisticsUpgrade | undefined => {
  return LOGISTICS_UPGRADES.find((u) => u.id === id);
};

export const getLogisticsCost = (
  baseCost: number,
  currentLevel: number
): number => {
  return Math.floor(baseCost * Math.pow(LOGISTICS_COST_MULTIPLIER, currentLevel));
};

export const MINE_DEPTH_BASE_COST = 100;
export const MINE_DEPTH_COST_MULTIPLIER = 1.5;

export const getMineDepthCost = (currentDepth: number): number => {
  return Math.floor(
    MINE_DEPTH_BASE_COST * Math.pow(MINE_DEPTH_COST_MULTIPLIER, currentDepth - 1)
  );
};

export const UPGRADE_COST_MULTIPLIER = 2;

export const getMinerUpgradeCost = (
  baseCost: number,
  currentLevel: number
): number => {
  return Math.floor(baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, currentLevel));
};
