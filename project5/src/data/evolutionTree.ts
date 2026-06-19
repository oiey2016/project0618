import type { Species, EvolutionStage } from '@/types';

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    id: 1,
    name: '宇宙尘埃',
    description: '一切从虚无中诞生，最基本的粒子在混沌中漂浮',
    bgClass: 'cosmic-gradient',
    unlockLevel: 1,
  },
  {
    id: 2,
    name: '生命起源',
    description: '在深海热泉中，生命的火花第一次闪现',
    bgClass: 'ocean-gradient',
    unlockLevel: 4,
  },
  {
    id: 3,
    name: '微观世界',
    description: '微小的生命开始繁衍，演化出多样的形态',
    bgClass: 'ocean-gradient',
    unlockLevel: 7,
  },
  {
    id: 4,
    name: '多细胞',
    description: '细胞们聚集在一起，形成了更复杂的生命体',
    bgClass: 'ocean-gradient',
    unlockLevel: 10,
  },
  {
    id: 5,
    name: '海洋生物',
    description: '蔚蓝的海洋中充满了各种奇妙的生物',
    bgClass: 'ocean-gradient',
    unlockLevel: 13,
  },
  {
    id: 6,
    name: '登陆时代',
    description: '生命勇敢地踏上陆地，开启新的纪元',
    bgClass: 'earth-gradient',
    unlockLevel: 16,
  },
  {
    id: 7,
    name: '恐龙时代',
    description: '巨大的爬行动物统治着这片古老的大陆',
    bgClass: 'earth-gradient',
    unlockLevel: 19,
  },
  {
    id: 8,
    name: '哺乳动物',
    description: '在冰河的考验中，智慧的哺乳动物悄然崛起',
    bgClass: 'earth-gradient',
    unlockLevel: 22,
  },
  {
    id: 9,
    name: '人类文明',
    description: '火与工具的使用者，开始书写文明的史诗',
    bgClass: 'civilization-gradient',
    unlockLevel: 25,
  },
  {
    id: 10,
    name: '现代社会',
    description: '科技的力量改变了世界，人类飞向天空',
    bgClass: 'civilization-gradient',
    unlockLevel: 28,
  },
  {
    id: 11,
    name: '星际时代',
    description: '人类的脚步迈向星辰大海，殖民整个星系',
    bgClass: 'space-gradient',
    unlockLevel: 31,
  },
  {
    id: 12,
    name: '神级文明',
    description: '超越维度，成为新宇宙的创造者',
    bgClass: 'divine-gradient',
    unlockLevel: 34,
  },
];

export const SPECIES: Species[] = [
  { level: 1, name: '夸克', emoji: '✨', description: '宇宙中最基本的粒子，构成万物的基石', stage: 1, rarity: 'common' },
  { level: 2, name: '原子', emoji: '⚛️', description: '质子、中子、电子组成的微小世界', stage: 1, rarity: 'common' },
  { level: 3, name: '分子', emoji: '💫', description: '原子们手拉手，形成了稳定的结构', stage: 1, rarity: 'rare' },
  { level: 4, name: '氨基酸', emoji: '🧬', description: '生命的基本构件，蕴含着无限可能', stage: 2, rarity: 'common' },
  { level: 5, name: 'DNA链', emoji: '🔗', description: '双螺旋结构，携带着生命的密码', stage: 2, rarity: 'rare' },
  { level: 6, name: '单细胞', emoji: '🦠', description: '第一个真正的生命，在原始海洋中诞生', stage: 2, rarity: 'legendary' },
  { level: 7, name: '细菌', emoji: '🔵', description: '微小却顽强，遍布世界的每一个角落', stage: 3, rarity: 'common' },
  { level: 8, name: '藻类', emoji: '🌿', description: '最早的光合作用者，为地球带来氧气', stage: 3, rarity: 'common' },
  { level: 9, name: '变形虫', emoji: '🟢', description: '自由改变形态，吞噬食物的原生生物', stage: 3, rarity: 'rare' },
  { level: 10, name: '海绵', emoji: '🧽', description: '最简单的多细胞生物，静静地过滤海水', stage: 4, rarity: 'common' },
  { level: 11, name: '水母', emoji: '🪼', description: '透明的精灵，在海洋中优雅地漂浮', stage: 4, rarity: 'rare' },
  { level: 12, name: '珊瑚', emoji: '🪸', description: '无数微小的生命，建造起海底的森林', stage: 4, rarity: 'legendary' },
  { level: 13, name: '贝壳', emoji: '🐚', description: '柔软的身体藏在坚硬的壳中，随波逐流', stage: 5, rarity: 'common' },
  { level: 14, name: '鱼', emoji: '🐟', description: '脊椎动物的祖先，在水中自由穿梭', stage: 5, rarity: 'common' },
  { level: 15, name: '章鱼', emoji: '🐙', description: '八只触手的智慧生物，海洋中的灵长类', stage: 5, rarity: 'rare' },
  { level: 16, name: '蕨类植物', emoji: '🌱', description: '最早的陆地征服者，在岩石上开辟绿洲', stage: 6, rarity: 'common' },
  { level: 17, name: '昆虫', emoji: '🐛', description: '六足的探险家，飞向天空的先驱', stage: 6, rarity: 'common' },
  { level: 18, name: '两栖动物', emoji: '🦎', description: '勇敢地离开水，探索陌生的陆地', stage: 6, rarity: 'rare' },
  { level: 19, name: '裸子植物', emoji: '🌲', description: '高大的针叶林，覆盖远古的大地', stage: 7, rarity: 'common' },
  { level: 20, name: '翼龙', emoji: '🦅', description: '第一个征服天空的脊椎动物', stage: 7, rarity: 'rare' },
  { level: 21, name: '恐龙', emoji: '🦕', description: '地球的霸主，统治长达一亿六千万年', stage: 7, rarity: 'legendary' },
  { level: 22, name: '远古花卉', emoji: '🌸', description: '花朵绽放，为世界带来色彩与芬芳', stage: 8, rarity: 'common' },
  { level: 23, name: '剑齿虎', emoji: '🐯', description: '冰河时代的顶级掠食者', stage: 8, rarity: 'rare' },
  { level: 24, name: '猛犸象', emoji: '🐘', description: '长毛巨兽，在冰原上艰难求生', stage: 8, rarity: 'legendary' },
  { level: 25, name: '部落', emoji: '🏕️', description: '人类聚集在一起，形成最早的社群', stage: 9, rarity: 'common' },
  { level: 26, name: '城邦', emoji: '🏛️', description: '宏伟的城市，文明的曙光初现', stage: 9, rarity: 'rare' },
  { level: 27, name: '帝国', emoji: '👑', description: '横跨大陆的伟大帝国，书写历史的篇章', stage: 9, rarity: 'legendary' },
  { level: 28, name: '城市', emoji: '🏙️', description: '摩天大楼拔地而起，霓虹闪烁不夜城', stage: 10, rarity: 'common' },
  { level: 29, name: '科技', emoji: '💻', description: '硅晶片上的革命，信息时代的开端', stage: 10, rarity: 'rare' },
  { level: 30, name: '火箭', emoji: '🚀', description: '挣脱引力的束缚，迈向浩瀚星空', stage: 10, rarity: 'legendary' },
  { level: 31, name: '飞船', emoji: '🛸', description: '曲率驱动的星际飞船，穿梭于银河之间', stage: 11, rarity: 'common' },
  { level: 32, name: '殖民地', emoji: '🪐', description: '在异星建立家园，人类成为多行星物种', stage: 11, rarity: 'rare' },
  { level: 33, name: '戴森球', emoji: '⭐', description: '包裹恒星的巨型结构，收集整个太阳的能量', stage: 11, rarity: 'legendary' },
  { level: 34, name: '星系', emoji: '🌌', description: '掌控整个星系，亿万星辰为你闪耀', stage: 12, rarity: 'rare' },
  { level: 35, name: '宇宙', emoji: '🔮', description: '创造新的宇宙，制定新的物理法则', stage: 12, rarity: 'legendary' },
  { level: 36, name: '新维度', emoji: '♾️', description: '超越一切维度，成为真正的造物主', stage: 12, rarity: 'legendary' },
];

export const MAX_LEVEL = 36;
export const MAX_ENTITIES = 50;
export const MIRACLE_CHANCE = 0.05;
export const AUTO_SAVE_INTERVAL = 30000;

export const getSpeciesByLevel = (level: number): Species | undefined => {
  return SPECIES.find(s => s.level === level);
};

export const getStageByLevel = (level: number): EvolutionStage => {
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (level >= EVOLUTION_STAGES[i].unlockLevel) {
      return EVOLUTION_STAGES[i];
    }
  }
  return EVOLUTION_STAGES[0];
};

export const getGlowClass = (rarity: string): string => {
  switch (rarity) {
    case 'legendary':
      return 'life-glow-legendary';
    case 'rare':
      return 'life-glow-rare';
    default:
      return 'life-glow-common';
  }
};

export const getFloatAnimation = (level: number): string => {
  if (level % 3 === 0) return 'animate-float-slow';
  if (level % 3 === 1) return 'animate-float-medium';
  return 'animate-float-fast';
};

export const getEntitySize = (level: number): number => {
  const baseSize = 48;
  const increment = 4;
  return Math.min(baseSize + (level - 1) * increment, 96);
};
