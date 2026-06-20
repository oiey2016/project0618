export type GamePhase = 'menu' | 'countdown' | 'playing' | 'roundEnd' | 'gameEnd';

export type PlayerId = 'P1' | 'P2';

export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  id: PlayerId;
  position: Vector2;
  velocity: Vector2;
  inputDirection: Vector2;
  radius: number;
  color: string;
  glowColor: string;
  darkColor: string;
  score: number;
  isAlive: boolean;
  trail: Vector2[];
}

export interface Particle {
  id: number;
  position: Vector2;
  velocity: Vector2;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  decay: number;
}

export interface Shockwave {
  id: number;
  position: Vector2;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface GameConfig {
  arenaRadius: number;
  playerRadius: number;
  roundsToWin: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  restitution: number;
  pushForce: number;
  trailLength: number;
  dangerZoneRatio: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  arenaRadius: 300,
  playerRadius: 28,
  roundsToWin: 3,
  acceleration: 0.55,
  maxSpeed: 9,
  friction: 0.94,
  restitution: 0.75,
  pushForce: 1.3,
  trailLength: 12,
  dangerZoneRatio: 0.85,
};

export const P1_COLORS = {
  main: '#3b82f6',
  glow: '#60a5fa',
  dark: '#1d4ed8',
};

export const P2_COLORS = {
  main: '#f97316',
  glow: '#fb923c',
  dark: '#c2410c',
};
