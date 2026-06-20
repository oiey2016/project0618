import type { Equipment, Rarity, RarityConfig } from '@/types';

export const equipment: Equipment[] = [
  {
    id: 'weapon-1',
    name: '木棍',
    type: 'weapon',
    rarity: 'common',
    price: 30,
    description: '一根普通的木棍，是初学者的入门武器。',
    emoji: '🥢',
    stats: { attack: 3 },
  },
  {
    id: 'weapon-2',
    name: '铁剑',
    type: 'weapon',
    rarity: 'rare',
    price: 100,
    description: '锋利的铁剑，能有效提升攻击力。',
    emoji: '⚔️',
    stats: { attack: 8 },
  },
  {
    id: 'weapon-3',
    name: '魔法权杖',
    type: 'weapon',
    rarity: 'epic',
    price: 250,
    description: '蕴含魔法力量的权杖，还有幸运加成。',
    emoji: '🪄',
    stats: { attack: 12, luck: 5 },
  },
  {
    id: 'weapon-4',
    name: '传说神剑',
    type: 'weapon',
    rarity: 'legendary',
    price: 500,
    description: '传说中的神剑，拥有无与伦比的力量。',
    emoji: '🌟',
    stats: { attack: 20, luck: 8 },
  },
  {
    id: 'armor-1',
    name: '布甲',
    type: 'armor',
    rarity: 'common',
    price: 30,
    description: '简单的布甲，提供基础防护。',
    emoji: '👕',
    stats: { defense: 3 },
  },
  {
    id: 'armor-2',
    name: '皮甲',
    type: 'armor',
    rarity: 'rare',
    price: 100,
    description: '结实的皮革护甲，防护效果不错。',
    emoji: '🦺',
    stats: { defense: 8 },
  },
  {
    id: 'armor-3',
    name: '锁子甲',
    type: 'armor',
    rarity: 'epic',
    price: 250,
    description: '由金属环编织而成，坚固耐用。',
    emoji: '🛡️',
    stats: { defense: 15 },
  },
  {
    id: 'armor-4',
    name: '龙鳞甲',
    type: 'armor',
    rarity: 'legendary',
    price: 500,
    description: '用龙鳞打造的神甲，刀枪不入。',
    emoji: '🐉',
    stats: { defense: 25, attack: 5 },
  },
  {
    id: 'accessory-1',
    name: '幸运硬币',
    type: 'accessory',
    rarity: 'common',
    price: 40,
    description: '一枚据说能带来好运的硬币。',
    emoji: '🪙',
    stats: { luck: 5 },
  },
  {
    id: 'accessory-2',
    name: '智慧项链',
    type: 'accessory',
    rarity: 'rare',
    price: 120,
    description: '能提升智慧的神秘项链。',
    emoji: '📿',
    stats: { luck: 10, attack: 3 },
  },
  {
    id: 'accessory-3',
    name: '勇者徽章',
    type: 'accessory',
    rarity: 'epic',
    price: 280,
    description: '勇者的象征，能提升全面能力。',
    emoji: '🎖️',
    stats: { attack: 5, defense: 5, luck: 8 },
  },
  {
    id: 'accessory-4',
    name: '知识王冠',
    type: 'accessory',
    rarity: 'legendary',
    price: 600,
    description: '知识之王的王冠，拥有无上智慧。',
    emoji: '👑',
    stats: { attack: 10, defense: 10, luck: 15 },
  },
];

export const rarityConfig: Record<Rarity, RarityConfig> = {
  common: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    label: '普通',
  },
  rare: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    label: '稀有',
  },
  epic: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    label: '史诗',
  },
  legendary: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    label: '传说',
  },
};

export function getEquipmentById(id: string): Equipment | undefined {
  return equipment.find((e) => e.id === id);
}

export function getEquipmentByType(type: string): Equipment[] {
  return equipment.filter((e) => e.type === type);
}
