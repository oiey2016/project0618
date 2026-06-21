export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Goal {
  x: number;
  y: number;
  radius: number;
}

export interface Hole {
  x: number;
  y: number;
  radius: number;
}

export interface Level {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ballStart: { x: number; y: number };
  goal: Goal;
  walls: Wall[];
  holes: Hole[];
}

export interface GameState {
  currentLevel: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  time: number;
  bestTime: number | null;
  ball: Ball;
}

export interface Vector {
  x: number;
  y: number;
}