export interface GameState {
  eggs: number;
  totalEggs: number;
  eggsPerClick: number;
  eggsPerSecond: number;
  totalClicks: number;
  currentStage: number;
  upgrades: Record<string, number>;
  achievements: string[];
  lastSaveTime: number;
  playTime: number;
  multiplier: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  baseEffect: number;
  effectType: 'click' | 'auto' | 'multiplier';
  unlockStage: number;
}

export interface Stage {
  id: number;
  name: string;
  description: string;
  requiredEggs: number;
  bgGradient: string;
  chickenEmoji: string;
  unlockMessage: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: GameState) => boolean;
  reward: number;
}

export type ActionType =
  | { type: 'CLICK' }
  | { type: 'TICK'; deltaTime: number }
  | { type: 'BUY_UPGRADE'; upgradeId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'ADVANCE_STAGE' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'APPLY_OFFLINE_EARNINGS'; eggs: number }
  | { type: 'RESET_GAME' };
