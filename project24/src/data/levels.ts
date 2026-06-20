import { Level, ColorKey } from '@/types';

const e: ColorKey = 'empty';
const r: ColorKey = 'red';
const p: ColorKey = 'pink';
const o: ColorKey = 'orange';
const y: ColorKey = 'yellow';
const g: ColorKey = 'green';
const t: ColorKey = 'teal';
const b: ColorKey = 'blue';
const pu: ColorKey = 'purple';
const br: ColorKey = 'brown';
const bl: ColorKey = 'black';
const w: ColorKey = 'white';
const gr: ColorKey = 'gray';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: '小爱心',
    difficulty: 'easy',
    gridSize: 8,
    pattern: [
      [e, e, e, e, e, e, e, e],
      [e, p, p, e, e, p, p, e],
      [p, p, p, p, p, p, p, p],
      [p, p, p, p, p, p, p, p],
      [e, p, p, p, p, p, p, e],
      [e, e, p, p, p, p, e, e],
      [e, e, e, p, p, e, e, e],
      [e, e, e, e, e, e, e, e],
    ],
  },
  {
    id: 2,
    name: '小蘑菇',
    difficulty: 'easy',
    gridSize: 8,
    pattern: [
      [e, e, r, r, r, r, e, e],
      [e, r, r, w, w, r, r, e],
      [r, r, w, w, w, w, r, r],
      [r, r, r, r, r, r, r, r],
      [e, w, w, w, w, w, w, e],
      [e, e, w, w, w, w, e, e],
      [e, e, w, w, w, w, e, e],
      [e, e, e, br, br, e, e, e],
    ],
  },
  {
    id: 3,
    name: '小猫咪',
    difficulty: 'medium',
    gridSize: 10,
    pattern: [
      [e, e, e, e, e, e, e, e, e, e],
      [e, bl, bl, e, e, e, e, bl, bl, e],
      [e, bl, bl, bl, e, e, bl, bl, bl, e],
      [e, bl, w, bl, bl, bl, bl, w, bl, e],
      [e, bl, bl, bl, bl, bl, bl, bl, bl, e],
      [e, bl, bl, p, bl, bl, p, bl, bl, e],
      [e, e, bl, bl, bl, bl, bl, bl, e, e],
      [e, e, e, bl, w, w, bl, e, e, e],
      [e, e, e, e, bl, bl, e, e, e, e],
      [e, e, e, e, e, e, e, e, e, e],
    ],
  },
  {
    id: 4,
    name: '小太阳',
    difficulty: 'medium',
    gridSize: 10,
    pattern: [
      [e, e, e, y, e, e, y, e, e, e],
      [e, y, e, e, y, y, e, e, y, e],
      [e, e, o, e, y, y, e, o, e, e],
      [y, e, e, y, y, y, y, e, e, y],
      [e, y, y, y, o, o, y, y, y, e],
      [e, y, y, y, o, o, y, y, y, e],
      [y, e, e, y, y, y, y, e, e, y],
      [e, e, o, e, y, y, e, o, e, e],
      [e, y, e, e, y, y, e, e, y, e],
      [e, e, e, y, e, e, y, e, e, e],
    ],
  },
  {
    id: 5,
    name: '小房子',
    difficulty: 'hard',
    gridSize: 12,
    pattern: [
      [e, e, e, e, e, r, r, e, e, e, e, e],
      [e, e, e, e, r, r, r, r, e, e, e, e],
      [e, e, e, r, r, r, r, r, r, e, e, e],
      [e, e, r, r, r, r, r, r, r, r, e, e],
      [e, br, br, br, br, br, br, br, br, br, br, e],
      [br, br, y, y, br, br, br, br, y, y, br, br],
      [br, br, y, y, br, br, br, br, y, y, br, br],
      [br, br, br, br, br, br, br, br, br, br, br, br],
      [br, br, br, br, br, br, br, br, br, br, br, br],
      [br, br, br, br, bl, bl, bl, bl, br, br, br, br],
      [br, br, br, br, bl, w, w, bl, br, br, br, br],
      [br, br, br, br, bl, w, w, bl, br, br, br, br],
    ],
  },
  {
    id: 6,
    name: '像素花朵',
    difficulty: 'hard',
    gridSize: 12,
    pattern: [
      [e, e, e, e, e, p, p, e, e, e, e, e],
      [e, e, e, p, p, p, p, p, p, e, e, e],
      [e, e, p, p, p, y, y, p, p, p, e, e],
      [e, p, p, y, y, y, y, y, y, p, p, e],
      [e, p, y, y, w, w, w, w, y, y, p, e],
      [p, p, y, w, y, y, y, y, w, y, p, p],
      [p, p, y, w, y, g, g, y, w, y, p, p],
      [e, p, y, y, w, w, w, w, y, y, p, e],
      [e, p, p, y, y, y, y, y, y, p, p, e],
      [e, e, p, p, p, g, g, p, p, p, e, e],
      [e, e, e, g, g, g, g, g, g, e, e, e],
      [e, e, e, e, g, g, g, g, e, e, e, e],
    ],
  },
];

export const getLevelById = (id: number): Level | undefined => {
  return LEVELS.find(level => level.id === id);
};

export const getTotalLevels = (): number => LEVELS.length;
