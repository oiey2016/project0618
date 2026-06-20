import type { LevelDefinition } from './types'

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: '垫脚过关',
    hint: '试试输入"箱子"来垫脚吧',
    platforms: [
      { x: 50, y: 450, width: 200, height: 30, type: 'floating' },
      { x: 650, y: 200, width: 200, height: 30, type: 'floating' },
      { x: 650, y: 230, width: 30, height: 370, type: 'wall' },
    ],
    obstacles: [],
    goal: { x: 750, y: 200 },
    playerStart: { x: 150, y: 450 },
    allowedItems: ['box', 'bridge', 'wall', 'ice'],
    maxItems: 5,
    starThresholds: { three: 30, two: 60 },
    background: '#87CEEB',
  },
  {
    id: 2,
    name: '飞天之路',
    hint: '有些东西可以飞起来哦',
    platforms: [
      { x: 0, y: 550, width: 1200, height: 50, type: 'ground' },
      { x: 500, y: 100, width: 200, height: 30, type: 'floating' },
    ],
    obstacles: [],
    goal: { x: 600, y: 100 },
    playerStart: { x: 100, y: 550 },
    allowedItems: ['balloon', 'box', 'spring', 'fan'],
    maxItems: 4,
    starThresholds: { three: 25, two: 50 },
    background: '#FFE0B2',
  },
  {
    id: 3,
    name: '弹跳峡谷',
    hint: '弹一弹，跳更高',
    platforms: [
      { x: 0, y: 350, width: 200, height: 30, type: 'floating' },
      { x: 650, y: 250, width: 30, height: 350, type: 'wall' },
      { x: 680, y: 250, width: 120, height: 30, type: 'floating' },
    ],
    obstacles: [
      { x: 350, y: 570, width: 300, height: 30, type: 'spike' },
    ],
    goal: { x: 700, y: 250 },
    playerStart: { x: 100, y: 350 },
    allowedItems: ['spring', 'box', 'bridge', 'balloon'],
    maxItems: 5,
    starThresholds: { three: 35, two: 65 },
    background: '#C8E6C9',
  },
  {
    id: 4,
    name: '风之引导',
    hint: '风可以推着你走',
    platforms: [
      { x: 0, y: 480, width: 250, height: 30, type: 'floating' },
      { x: 650, y: 400, width: 200, height: 30, type: 'floating' },
    ],
    obstacles: [
      { x: 300, y: 480, width: 300, height: 30, type: 'fire' },
    ],
    goal: { x: 750, y: 400 },
    playerStart: { x: 100, y: 480 },
    allowedItems: ['fan', 'balloon', 'bridge', 'box'],
    maxItems: 4,
    starThresholds: { three: 30, two: 55 },
    background: '#E1BEE7',
  },
  {
    id: 5,
    name: '终极挑战',
    hint: '发挥你的想象力吧',
    platforms: [
      { x: 0, y: 500, width: 150, height: 30, type: 'floating' },
      { x: 300, y: 400, width: 100, height: 20, type: 'floating' },
      { x: 550, y: 300, width: 100, height: 20, type: 'floating' },
      { x: 900, y: 200, width: 200, height: 30, type: 'floating' },
    ],
    obstacles: [
      { x: 150, y: 520, width: 150, height: 30, type: 'spike' },
      { x: 400, y: 420, width: 150, height: 30, type: 'fire' },
    ],
    goal: { x: 1000, y: 200 },
    playerStart: { x: 75, y: 500 },
    allowedItems: ['box', 'balloon', 'spring', 'bridge', 'wall', 'fan', 'ice'],
    maxItems: 7,
    starThresholds: { three: 45, two: 80 },
    background: '#FFCDD2',
  },
]

export function getLevelById(id: number): LevelDefinition | undefined {
  return LEVELS.find((level) => level.id === id)
}
