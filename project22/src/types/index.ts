export enum BlockType {
  AIR = 'air',
  GRASS = 'grass',
  DIRT = 'dirt',
  STONE = 'stone',
  WOOD = 'wood',
  LEAVES = 'leaves',
  SAND = 'sand',
  WATER = 'water',
  PLANKS = 'planks',
  COBBLESTONE = 'cobblestone',
}

export interface BlockProperties {
  id: BlockType;
  name: string;
  color: string;
  hardness: number;
  transparent: boolean;
}

export type WorldMap = Map<string, BlockType>;

export interface WorldState {
  blocks: WorldMap;
  size: { width: number; height: number; depth: number };
  seed: number;
}

export interface PlayerState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  yaw: number;
  pitch: number;
  onGround: boolean;
  health: number;
  hunger: number;
  selectedSlot: number;
  inventory: InventorySlot[];
}

export interface InventorySlot {
  blockType: BlockType | null;
  count: number;
}

export interface GameSettings {
  renderDistance: number;
  mouseSensitivity: number;
  volume: number;
}

export interface GameState {
  phase: 'menu' | 'playing' | 'paused';
  world: WorldState;
  player: PlayerState;
  settings: GameSettings;
}

export interface HitInfo {
  blockPosition: { x: number; y: number; z: number };
  faceNormal: { x: number; y: number; z: number };
  distance: number;
}
