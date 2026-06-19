import type { Dish } from '@/types';

export const DISHES: Dish[] = [
  {
    id: 'fish-cake',
    name: '小鱼干蛋糕',
    description: '香喷喷的小鱼干配上松软蛋糕，猫咪的最爱入门款',
    emoji: '🐟',
    basePrice: 10,
    unlockCost: 0,
    unlockTime: 0,
    attractsCats: ['orange-tabby', 'white-cat'],
    rarity: 'common',
  },
  {
    id: 'tuna-muffin',
    name: '金枪鱼玛芬',
    description: '金枪鱼肉松满满，咸香可口的小点心',
    emoji: '🧁',
    basePrice: 18,
    unlockCost: 100,
    unlockTime: 30,
    attractsCats: ['gray-tabby', 'calico-cat'],
    rarity: 'common',
  },
  {
    id: 'shrimp-sushi',
    name: '鲜虾寿司',
    description: '新鲜甜虾配上软糯米饭，高级料理的享受',
    emoji: '🍣',
    basePrice: 35,
    unlockCost: 300,
    unlockTime: 60,
    attractsCats: ['siamese', 'persian'],
    rarity: 'rare',
  },
  {
    id: 'salmon-bowl',
    name: '三文鱼盖饭',
    description: '厚厚一层三文鱼，营养满分的豪华套餐',
    emoji: '🍱',
    basePrice: 50,
    unlockCost: 600,
    unlockTime: 120,
    attractsCats: ['ragdoll', 'norwegian'],
    rarity: 'rare',
  },
  {
    id: 'lobster-feast',
    name: '龙虾盛宴',
    description: '整只大龙虾，只有尊贵的猫咪才能享用',
    emoji: '🦞',
    basePrice: 100,
    unlockCost: 1500,
    unlockTime: 240,
    attractsCats: ['maine-coon', 'bengal'],
    rarity: 'epic',
  },
  {
    id: 'caviar-gold',
    name: '黄金鱼子酱',
    description: '传说中的顶级美味，传说中的猫咪才会光临',
    emoji: '✨',
    basePrice: 200,
    unlockCost: 5000,
    unlockTime: 480,
    attractsCats: ['mystery-cat'],
    rarity: 'epic',
  },
  {
    id: 'cream-puff',
    name: '奶油泡芙',
    description: '轻盈的奶油夹心，甜而不腻的小甜点',
    emoji: '🍮',
    basePrice: 25,
    unlockCost: 200,
    unlockTime: 45,
    attractsCats: ['munchkin', 'scottish-fold'],
    rarity: 'rare',
  },
  {
    id: 'moon-cake',
    name: '喵星月饼',
    description: '特殊节日限定，据说能招来神秘的月亮猫',
    emoji: '🥮',
    basePrice: 80,
    unlockCost: 1000,
    unlockTime: 180,
    attractsCats: ['moon-cat'],
    rarity: 'epic',
  },
];

export const getDishById = (id: string): Dish | undefined => {
  return DISHES.find(dish => dish.id === id);
};

export const getDishesByRarity = (rarity: Dish['rarity']): Dish[] => {
  return DISHES.filter(dish => dish.rarity === rarity);
};
