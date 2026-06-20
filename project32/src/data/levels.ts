import type { Level } from '@/types';

export const levels: Level[] = [
  {
    id: 'level-1',
    name: '新手村',
    description: '欢迎来到知识大陆！从这里开始你的冒险吧。',
    emoji: '🏠',
    questionIds: ['q001', 'q009', 'q017', 'q029', 'q031'],
    rewardGold: 50,
    rewardExp: 20,
    position: { x: 15, y: 75 },
  },
  {
    id: 'level-2',
    name: '迷雾森林',
    description: '神秘的森林中藏着许多自然的秘密。',
    emoji: '🌲',
    questionIds: ['q002', 'q005', 'q007', 'q008', 'q030'],
    rewardGold: 80,
    rewardExp: 35,
    position: { x: 30, y: 55 },
  },
  {
    id: 'level-3',
    name: '数学山谷',
    description: '数字的奥秘等待你去探索。',
    emoji: '🔢',
    questionIds: ['q010', 'q011', 'q013', 'q014', 'q015', 'q016'],
    rewardGold: 100,
    rewardExp: 45,
    position: { x: 50, y: 40 },
  },
  {
    id: 'level-4',
    name: '历史遗迹',
    description: '古老的文明留下了珍贵的智慧。',
    emoji: '🏛️',
    questionIds: ['q018', 'q019', 'q020', 'q021', 'q022'],
    rewardGold: 120,
    rewardExp: 55,
    position: { x: 70, y: 55 },
  },
  {
    id: 'level-5',
    name: '地理大冒险',
    description: '环游世界，了解我们的地球家园。',
    emoji: '🌍',
    questionIds: ['q023', 'q024', 'q025', 'q026', 'q027', 'q028'],
    rewardGold: 150,
    rewardExp: 70,
    position: { x: 85, y: 75 },
  },
  {
    id: 'level-6',
    name: '科学实验室',
    description: '探索物理世界的神奇规律。',
    emoji: '⚗️',
    questionIds: ['q003', 'q004', 'q006', 'q035', 'q036', 'q037', 'q038'],
    rewardGold: 200,
    rewardExp: 90,
    position: { x: 50, y: 20 },
  },
];

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getNextLevel(currentId: string): Level | undefined {
  const currentIndex = levels.findIndex((l) => l.id === currentId);
  if (currentIndex >= 0 && currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return undefined;
}
