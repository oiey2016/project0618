export interface Resources {
  wood: number;
  stone: number;
  metal: number;
  food: number;
  water: number;
  medicine: number;
  scrap: number;
}

export interface PlayerStatus {
  health: number;
  maxHealth: number;
  hunger: number;
  thirst: number;
  baseAttack: number;
  baseDefense: number;
}

export interface BuildingConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  maxLevel: number;
  baseCost: Partial<Resources>;
  upgradeCostMultiplier: number;
  effectPerLevel: string;
  category: 'shelter' | 'production' | 'defense' | 'storage';
}

export interface Building {
  id: string;
  level: number;
}

export interface WeaponConfig {
  id: string;
  name: string;
  icon: string;
  type: 'melee' | 'ranged';
  attack: number;
  maxDurability: number;
  description: string;
  cost: Partial<Resources>;
  craftTime: number;
  tier: number;
}

export interface Weapon {
  id: string;
  configId: string;
  durability: number;
}

export interface LocationConfig {
  id: string;
  name: string;
  icon: string;
  dangerLevel: number;
  duration: number;
  baseRewards: Partial<Resources>;
  zombieChance: number;
  zombieCount: number;
  description: string;
}

export type GamePhase = 'day' | 'night';

export type ActivePanel = 'none' | 'build' | 'craft' | 'explore' | 'inventory';

export interface GameState {
  day: number;
  phase: GamePhase;
  phaseProgress: number;
  dayDuration: number;
  nightDuration: number;
  resources: Resources;
  player: PlayerStatus;
  buildings: Building[];
  weapons: Weapon[];
  equippedWeaponId: string | null;
  isExploring: boolean;
  exploreProgress: number;
  currentLocationId: string | null;
  isUnderAttack: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  activePanel: ActivePanel;
  battleLog: string[];
  notification: string | null;
  showGameplay: boolean;
  hasSeenGameplay: boolean;
}

export interface Zombie {
  health: number;
  maxHealth: number;
  attack: number;
  type: 'normal' | 'fast' | 'tank';
}
