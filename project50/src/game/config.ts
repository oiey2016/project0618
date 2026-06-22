import { JudgementType } from './types';

export const GAME_CONFIG = {
  maxHealth: 100,
  initialHealth: 100,
  noteSpeed: 150,
  spawnDistance: 400,
  hitRadius: 80,

  judgement: {
    perfect: { angleDiff: 8, score: 100, color: '#4FC3F7' },
    great: { angleDiff: 18, score: 70, color: '#81C784' },
    good: { angleDiff: 30, score: 40, color: '#FFD54F' },
    miss: { score: 0, healthCost: 8 }
  },

  noteColors: {
    normal: '#4FC3F7',
    bonus: '#CE93D8',
    danger: '#F48FB1'
  },

  hitEffectDuration: 500,
  particleCount: 12,
  particleSpeed: 150,
  particleLife: 600,

  pointerSmoothing: 0.15,
  defaultSensitivity: 1.0,
  minSensitivity: 0.5,
  maxSensitivity: 2.0,

  comboBonusThreshold: 10,
  comboBonusMultiplier: 0.1,
} as const;

export function getJudgement(angleDiff: number): JudgementType {
  const absDiff = Math.abs(angleDiff);
  if (absDiff <= GAME_CONFIG.judgement.perfect.angleDiff) return 'perfect';
  if (absDiff <= GAME_CONFIG.judgement.great.angleDiff) return 'great';
  if (absDiff <= GAME_CONFIG.judgement.good.angleDiff) return 'good';
  return 'miss';
}

export function getScore(judgement: JudgementType, combo: number): number {
  if (!judgement || judgement === 'miss') return 0;
  const baseScore = GAME_CONFIG.judgement[judgement].score;
  const comboBonus = combo >= GAME_CONFIG.comboBonusThreshold
    ? baseScore * GAME_CONFIG.comboBonusMultiplier * Math.min(combo / 10, 5)
    : 0;
  return Math.floor(baseScore + comboBonus);
}

export function getGrade(accuracy: number): { grade: string; color: string } {
  if (accuracy >= 95) return { grade: 'S', color: '#4FC3F7' };
  if (accuracy >= 90) return { grade: 'A', color: '#81C784' };
  if (accuracy >= 80) return { grade: 'B', color: '#FFD54F' };
  if (accuracy >= 70) return { grade: 'C', color: '#FFB74D' };
  return { grade: 'D', color: '#F48FB1' };
}
