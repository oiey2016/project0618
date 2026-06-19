export interface OreType {
  id: string;
  name: string;
  emoji: string;
  baseValue: number;
  unlockDepth: number;
  color: string;
}

export interface MinerType {
  id: string;
  name: string;
  emoji: string;
  baseCost: number;
  baseEfficiency: number;
  description: string;
}

export interface Miner {
  id: string;
  typeId: string;
  level: number;
  count: number;
}

export interface LogisticsUpgrade {
  id: string;
  name: string;
  description: string;
  emoji: string;
  baseCost: number;
  effect: number;
  maxLevel: number;
}

export interface GameState {
  gold: number;
  ores: Record<string, number>;
  mineDepth: number;
  miners: Miner[];
  logistics: Record<string, number>;
  totalEarnings: number;
  lastOnlineTime: number;
  gameSpeed: number;
  soundEnabled: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  oreId: string;
  value: number;
}

export type TabType = 'miners' | 'logistics' | 'upgrades';
