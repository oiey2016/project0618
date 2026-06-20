export const COLORS = {
  empty: 'transparent',
  red: '#FF6B6B',
  pink: '#FF6B9D',
  orange: '#FFA502',
  yellow: '#FFE66D',
  green: '#7BED9F',
  teal: '#4ECDC4',
  blue: '#74B9FF',
  purple: '#AA96DA',
  brown: '#A0522D',
  black: '#2D3436',
  white: '#FFFFFF',
  gray: '#B2BEC3',
} as const;

export type ColorKey = keyof typeof COLORS;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  id: number;
  name: string;
  difficulty: Difficulty;
  gridSize: number;
  pattern: ColorKey[][];
  timeLimit?: number;
  maxMistakes?: number;
}

export interface PixelBlock {
  id: string;
  color: ColorKey;
  targetRow: number;
  targetCol: number;
  isPlaced: boolean;
}

export interface GameState {
  currentLevel: number;
  completedLevels: Record<number, { stars: number; time: number }>;
  soundEnabled: boolean;
}

export interface GridCell {
  row: number;
  col: number;
  color: ColorKey | null;
  isCorrect: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#7BED9F',
  medium: '#FFE66D',
  hard: '#F38181',
};
