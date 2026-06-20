import { Puzzle } from '../types/game';

export const puzzles: Puzzle[] = [
  {
    id: 'study-door-lock',
    type: 'mechanism',
    answer: ['rusty-key'],
    requiredItem: 'rusty-key',
    reward: {
      type: 'scene',
      targetId: 'study',
    },
    hint: '这扇门似乎需要一把钥匙才能打开。',
    solved: false,
  },
  {
    id: 'safe-puzzle',
    type: 'password',
    answer: '0315',
    reward: {
      type: 'item',
      targetId: 'crowbar',
    },
    hint: '"我们的开始"——想想结婚纪念日。',
    solved: false,
  },
  {
    id: 'bookshelf-puzzle',
    type: 'sequence',
    answer: ['spring', 'summer', 'autumn', 'winter'],
    reward: {
      type: 'clue',
      targetId: 'clue-birthday',
    },
    hint: '书架上的书似乎需要按季节顺序排列。',
    solved: false,
  },
  {
    id: 'old-chest',
    type: 'mechanism',
    answer: ['rusty-key'],
    requiredItem: 'rusty-key',
    reward: {
      type: 'item',
      targetId: 'diary-page-3',
    },
    hint: '这个古老的箱子需要钥匙才能打开。',
    solved: false,
  },
  {
    id: 'stuck-drawer',
    type: 'mechanism',
    answer: ['crowbar'],
    requiredItem: 'crowbar',
    reward: {
      type: 'item',
      targetId: 'diary-page-1',
    },
    hint: '抽屉被卡住了，需要用什么东西撬开。',
    solved: false,
  },
  {
    id: 'basement-lock',
    type: 'password',
    answer: '0823',
    reward: {
      type: 'scene',
      targetId: 'basement',
    },
    hint: '"她来到这个世界的日子"——找出生日线索。',
    solved: false,
  },
  {
    id: 'floorboard-puzzle',
    type: 'mechanism',
    answer: ['crowbar'],
    requiredItem: 'crowbar',
    reward: {
      type: 'item',
      targetId: 'diary-page-2',
    },
    hint: '这块地板看起来有些松动。',
    solved: false,
  },
  {
    id: 'final-door',
    type: 'mechanism',
    answer: ['final-key'],
    requiredItem: 'final-key',
    reward: {
      type: 'ending',
      targetId: 'success',
    },
    hint: '这是最后一扇门，需要特殊的钥匙。',
    solved: false,
  },
  {
    id: 'altar-puzzle',
    type: 'sequence',
    answer: ['candle', 'photo', 'matches'],
    reward: {
      type: 'item',
      targetId: 'final-key',
    },
    hint: '祭坛上需要按特定顺序放置物品：先点燃蜡烛，再放上照片...',
    solved: false,
  },
];

export const getPuzzleById = (id: string): Puzzle | undefined => {
  return puzzles.find(puzzle => puzzle.id === id);
};
