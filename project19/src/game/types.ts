export type GamePhase = 'start' | 'playing' | 'won' | 'lost';

export type EnemyState = 'patrol' | 'chase' | 'search';

export type HidingSpotType = 'fridge' | 'box' | 'table';

export interface Point {
  x: number;
  y: number;
}

export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface Player extends Entity {
  speed: number;
  viewDistance: number;
  viewAngle: number;
  velocityX: number;
  velocityY: number;
}

export interface Enemy extends Entity {
  speed: number;
  viewDistance: number;
  viewAngle: number;
  state: EnemyState;
  patrolPath: Point[];
  currentPathIndex: number;
  lastSeenPlayerPos: Point | null;
  searchTimer: number;
  waitTimer: number;
}

export interface Key extends Entity {
  collected: boolean;
  id: number;
  rotation: number;
}

export interface HidingSpot extends Entity {
  id: number;
  occupied: boolean;
  type: HidingSpotType;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Door extends Entity {
  unlocked: boolean;
}

export interface GameStats {
  playTime: number;
  hideCount: number;
  nearMissCount: number;
  keysCollected: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  phase: GamePhase;
  player: Player;
  enemy: Enemy;
  keys: Key[];
  hidingSpots: HidingSpot[];
  walls: Wall[];
  door: Door;
  collectedKeys: number;
  isHiding: boolean;
  currentHidingSpot: HidingSpot | null;
  isChasing: boolean;
  gameTime: number;
  stats: GameStats;
  particles: Particle[];
  screenShake: number;
  flashEffect: { color: string; alpha: number };
  nearbyHidingSpot: HidingSpot | null;
  nearbyKey: Key | null;
  canInteract: boolean;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean;
}
