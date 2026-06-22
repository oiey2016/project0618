import type { Equipment } from '../types/game';

export interface EquipmentTemplate {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  icon: string;
  maxLevel: number;
  baseStats: Equipment['baseStats'];
  baseUpgradeCost: number;
  upgradeCostMultiplier: number;
}

export const equipmentTemplates: EquipmentTemplate[] = [
  {
    id: 'wooden_sword',
    name: '木剑',
    type: 'weapon',
    icon: '🗡️',
    maxLevel: 50,
    baseStats: { attack: 5 },
    baseUpgradeCost: 20,
    upgradeCostMultiplier: 1.35,
  },
  {
    id: 'iron_sword',
    name: '铁剑',
    type: 'weapon',
    icon: '⚔️',
    maxLevel: 80,
    baseStats: { attack: 15, critRate: 0.02 },
    baseUpgradeCost: 100,
    upgradeCostMultiplier: 1.4,
  },
  {
    id: 'magic_staff',
    name: '魔法杖',
    type: 'weapon',
    icon: '🪄',
    maxLevel: 100,
    baseStats: { attack: 25, critDamage: 0.2 },
    baseUpgradeCost: 500,
    upgradeCostMultiplier: 1.45,
  },
  {
    id: 'leather_armor',
    name: '皮甲',
    type: 'armor',
    icon: '🥋',
    maxLevel: 50,
    baseStats: { defense: 3, hp: 20 },
    baseUpgradeCost: 25,
    upgradeCostMultiplier: 1.35,
  },
  {
    id: 'iron_armor',
    name: '铁甲',
    type: 'armor',
    icon: '🛡️',
    maxLevel: 80,
    baseStats: { defense: 10, hp: 50 },
    baseUpgradeCost: 120,
    upgradeCostMultiplier: 1.4,
  },
  {
    id: 'dragon_armor',
    name: '龙鳞甲',
    type: 'armor',
    icon: '🐉',
    maxLevel: 100,
    baseStats: { defense: 20, hp: 120 },
    baseUpgradeCost: 600,
    upgradeCostMultiplier: 1.45,
  },
  {
    id: 'copper_ring',
    name: '铜戒指',
    type: 'accessory',
    icon: '💍',
    maxLevel: 50,
    baseStats: { attack: 2, critRate: 0.03 },
    baseUpgradeCost: 30,
    upgradeCostMultiplier: 1.35,
  },
  {
    id: 'silver_amulet',
    name: '银护符',
    type: 'accessory',
    icon: '📿',
    maxLevel: 80,
    baseStats: { hp: 30, defense: 5, critRate: 0.02 },
    baseUpgradeCost: 150,
    upgradeCostMultiplier: 1.4,
  },
  {
    id: 'golden_crown',
    name: '黄金王冠',
    type: 'accessory',
    icon: '👑',
    maxLevel: 100,
    baseStats: { attack: 15, critRate: 0.05, critDamage: 0.3 },
    baseUpgradeCost: 800,
    upgradeCostMultiplier: 1.5,
  },
];

export function createInitialEquipment(): Equipment[] {
  return equipmentTemplates
    .filter((t) => t.id === 'wooden_sword' || t.id === 'leather_armor' || t.id === 'copper_ring')
    .map((template) => ({
      id: template.id,
      name: template.name,
      type: template.type,
      icon: template.icon,
      level: 1,
      maxLevel: template.maxLevel,
      baseStats: { ...template.baseStats },
      upgradeCost: template.baseUpgradeCost,
      upgradeCostMultiplier: template.upgradeCostMultiplier,
    }));
}

export function getEquipmentStats(equipment: Equipment): Equipment['baseStats'] {
  const levelMultiplier = 1 + (equipment.level - 1) * 0.1;
  const stats: Equipment['baseStats'] = {};
  
  for (const [key, value] of Object.entries(equipment.baseStats)) {
    if (value !== undefined) {
      stats[key as keyof Equipment['baseStats']] = Math.floor(value * levelMultiplier * 100) / 100;
    }
  }
  
  return stats;
}

export function getUpgradeCost(equipment: Equipment): number {
  const template = equipmentTemplates.find((t) => t.id === equipment.id);
  if (!template) return Infinity;
  
  return Math.floor(
    template.baseUpgradeCost * Math.pow(template.upgradeCostMultiplier, equipment.level - 1)
  );
}
