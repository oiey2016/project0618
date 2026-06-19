export type Rarity = 'common' | 'rare' | 'legendary';

export interface LifeEntity {
  id: string;
  level: number;
  name: string;
  emoji: string;
  x: number;
  y: number;
  isDragging: boolean;
  createdAt: number;
  isNew: boolean;
}

export interface Species {
  level: number;
  name: string;
  emoji: string;
  description: string;
  stage: number;
  rarity: Rarity;
}

export interface EvolutionStage {
  id: number;
  name: string;
  description: string;
  bgClass: string;
  unlockLevel: number;
}

export interface GameState {
  entities: LifeEntity[];
  unlockedSpecies: number[];
  currentStage: number;
  totalMerges: number;
  highestLevel: number;
  lastSaveTime: number;
  isFirstPlay: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  tx: number;
  ty: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  emoji: string;
  isMiracle: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
