import type { BuildingConfig } from '../types/game';

export const BUILDING_CONFIGS: BuildingConfig[] = [
  {
    id: 'shelter',
    name: '庇护所',
    icon: '🏠',
    description: '你的避难所，提供基础防护',
    maxLevel: 5,
    baseCost: { wood: 30, stone: 20 },
    upgradeCostMultiplier: 1.8,
    effectPerLevel: '生命值上限+20，防御+2',
    category: 'shelter',
  },
  {
    id: 'storage',
    name: '仓库',
    icon: '📦',
    description: '存储资源的地方',
    maxLevel: 5,
    baseCost: { wood: 25, stone: 15 },
    upgradeCostMultiplier: 1.6,
    effectPerLevel: '资源存储上限+100',
    category: 'storage',
  },
  {
    id: 'workbench',
    name: '工作台',
    icon: '🔨',
    description: '制作武器和工具的地方',
    maxLevel: 3,
    baseCost: { wood: 40, metal: 20, scrap: 15 },
    upgradeCostMultiplier: 2.0,
    effectPerLevel: '解锁更高级武器，制作速度+20%',
    category: 'production',
  },
  {
    id: 'farm',
    name: '农田',
    icon: '🌾',
    description: '种植作物获取食物',
    maxLevel: 5,
    baseCost: { wood: 20, stone: 10 },
    upgradeCostMultiplier: 1.5,
    effectPerLevel: '每天产出食物+5',
    category: 'production',
  },
  {
    id: 'well',
    name: '水井',
    icon: '🚰',
    description: '获取干净的水源',
    maxLevel: 5,
    baseCost: { wood: 15, stone: 30 },
    upgradeCostMultiplier: 1.5,
    effectPerLevel: '每天产出水+5',
    category: 'production',
  },
  {
    id: 'wall',
    name: '围墙',
    icon: '🧱',
    description: '阻挡僵尸的防御工事',
    maxLevel: 5,
    baseCost: { stone: 40, wood: 10 },
    upgradeCostMultiplier: 1.7,
    effectPerLevel: '防御+5',
    category: 'defense',
  },
  {
    id: 'trap',
    name: '陷阱',
    icon: '🪤',
    description: '对僵尸造成额外伤害',
    maxLevel: 3,
    baseCost: { wood: 30, metal: 15, scrap: 20 },
    upgradeCostMultiplier: 1.8,
    effectPerLevel: '夜间战斗先手伤害+10',
    category: 'defense',
  },
  {
    id: 'tower',
    name: '瞭望塔',
    icon: '🗼',
    description: '提前发现僵尸，增加防御',
    maxLevel: 3,
    baseCost: { wood: 50, stone: 30, metal: 20 },
    upgradeCostMultiplier: 2.0,
    effectPerLevel: '防御+3，探索收益+10%',
    category: 'defense',
  },
  {
    id: 'medbay',
    name: '医疗站',
    icon: '🏥',
    description: '恢复生命值的设施',
    maxLevel: 3,
    baseCost: { wood: 35, stone: 25, metal: 15 },
    upgradeCostMultiplier: 1.9,
    effectPerLevel: '每天恢复生命+10',
    category: 'production',
  },
];

export const getBuildingConfig = (id: string): BuildingConfig | undefined => {
  return BUILDING_CONFIGS.find(b => b.id === id);
};

export const getBuildingCost = (config: BuildingConfig, level: number): Record<string, number> => {
  const cost: Record<string, number> = {};
  const multiplier = Math.pow(config.upgradeCostMultiplier, level);
  
  for (const [resource, baseCost] of Object.entries(config.baseCost)) {
    cost[resource] = Math.floor((baseCost as number) * multiplier);
  }
  
  return cost;
};
