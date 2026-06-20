import { PixelBlock, ColorKey, Level } from '@/types';

export const generateBlocksFromPattern = (pattern: ColorKey[][]): PixelBlock[] => {
  const blocks: PixelBlock[] = [];
  
  pattern.forEach((row, rowIndex) => {
    row.forEach((color, colIndex) => {
      if (color !== 'empty') {
        blocks.push({
          id: `${rowIndex}-${colIndex}-${Date.now()}-${Math.random()}`,
          color,
          targetRow: rowIndex,
          targetCol: colIndex,
          isPlaced: false,
        });
      }
    });
  });
  
  return shuffleArray(blocks);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateStars = (time: number, mistakes: number): number => {
  if (mistakes === 0 && time < 60) return 3;
  if (mistakes <= 2 && time < 120) return 2;
  return 1;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const createEmptyGrid = (size: number): (ColorKey | null)[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

export const isLevelUnlocked = (levelId: number, completedLevels: Record<number, unknown>): boolean => {
  if (levelId === 1) return true;
  return levelId - 1 in completedLevels;
};

export const getPatternThumbnail = (pattern: ColorKey[][]): ColorKey[][] => {
  return pattern;
};
