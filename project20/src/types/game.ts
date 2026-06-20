export interface Position {
  x: number;
  y: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export type InteractableType = 'item' | 'door' | 'puzzle' | 'furniture' | 'exit' | 'hidingSpot';

export interface Interactable {
  id: string;
  type: InteractableType;
  position: Position;
  size: { width: number; height: number };
  name: string;
  description: string;
  requiresItem?: string;
  givesItem?: string;
  leadsTo?: string;
  puzzleId?: string;
  solved?: boolean;
  visible?: boolean;
  collected?: boolean;
  locked?: boolean;
  hideDuration?: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  background: string;
  floorColor: string;
  wallColor: string;
  interactables: Interactable[];
  ghostPatrolPath?: Position[];
  exits: { direction: string; roomId: string; position: Position; doorId: string }[];
  playerStart: Position;
}

export interface Ghost {
  id: string;
  position: Position;
  targetPosition: Position;
  speed: number;
  patrolPath: Position[];
  patrolIndex: number;
  state: 'patrol' | 'chase' | 'search';
  detectionRadius: number;
  alertLevel: number;
  floatOffset: number;
  currentRoom: string;
}

export interface Player {
  position: Position;
  targetPosition: Position;
  speed: number;
  health: number;
  maxHealth: number;
  inventory: string[];
  currentRoom: string;
  isHidden: boolean;
  facing: 'left' | 'right';
}

export type GameState = 'menu' | 'playing' | 'paused' | 'dialog' | 'puzzle' | 'victory' | 'gameover' | 'instructions';

export type PuzzleType = 'code' | 'sequence';

export interface Puzzle {
  id: string;
  type: PuzzleType;
  title: string;
  description: string;
  solution: string;
  hint: string;
  rewardItemId?: string;
  unlocksDoorId?: string;
}

export interface Dialog {
  visible: boolean;
  text: string;
  speaker?: string;
}
