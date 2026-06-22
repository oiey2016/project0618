import type { Item } from '../types/game';

export const items: Item[] = [
  {
    id: 'small_potion',
    name: '小型生命药水',
    icon: '🧪',
    description: '立即恢复50点生命值',
    price: 50,
    type: 'consumable',
    effect: {
      stat: 'hp',
      value: 50,
    },
  },
  {
    id: 'medium_potion',
    name: '中型生命药水',
    icon: '🧴',
    description: '立即恢复200点生命值',
    price: 180,
    type: 'consumable',
    effect: {
      stat: 'hp',
      value: 200,
    },
  },
  {
    id: 'large_potion',
    name: '大型生命药水',
    icon: '⚗️',
    description: '立即恢复500点生命值',
    price: 400,
    type: 'consumable',
    effect: {
      stat: 'hp',
    value: 500,
    },
  },
  {
    id: 'attack_scroll',
    name: '力量卷轴',
    icon: '📜',
    description: '30分钟内攻击力提升20%',
    price: 300,
    type: 'buff',
    effect: {
      stat: 'attack',
      value: 0.2,
      duration: 30 * 60 * 1000,
    },
  },
  {
    id: 'defense_scroll',
    name: '守护卷轴',
    icon: '📋',
    description: '30分钟内防御力提升20%',
    price: 300,
    type: 'buff',
    effect: {
      stat: 'defense',
      value: 0.2,
      duration: 30 * 60 * 1000,
    },
  },
  {
    id: 'crit_scroll',
    name: '暴击卷轴',
    icon: '🎯',
    description: '30分钟内暴击率提升10%',
    price: 500,
    type: 'buff',
    effect: {
      stat: 'critRate',
      value: 0.1,
      duration: 30 * 60 * 1000,
    },
  },
  {
    id: 'exp_book',
    name: '经验秘籍',
    icon: '📚',
    description: '立即获得1000点经验值',
    price: 800,
    type: 'upgrade',
    effect: {
      stat: 'exp',
      value: 1000,
    },
  },
  {
    id: 'gold_bag',
    name: '金币袋',
    icon: '💰',
    description: '立即获得500金币',
    price: 10,
    type: 'upgrade',
    effect: {
      value: 500,
    },
  },
];

export function getItemById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}
