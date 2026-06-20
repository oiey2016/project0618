export enum BlockType {
  WOOD_PLANK = 'wood_plank',
  SPRING = 'spring',
  BALLOON = 'balloon',
  GLUE = 'glue',
  PIVOT = 'pivot',
  SOFT_BLOCK = 'soft_block',
}

export interface PlacedBlock {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  bodyId?: number;
}

export interface TerrainElement {
  id: string;
  type: 'ground' | 'platform' | 'wall' | 'obstacle' | 'goal';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  terrain: TerrainElement[];
  playerStart: { x: number; y: number };
  goalPosition: { x: number; y: number };
  availableBlocks: Partial<Record<BlockType, number>>;
  threeStarBlocks: number;
  twoStarBlocks: number;
  oneStarBlocks: number;
}

export type GameResult = 'success' | 'fail' | null;
export type StarsCount = 0 | 1 | 2 | 3;

export interface BlockInfo {
  type: BlockType;
  name: string;
  emoji: string;
  color: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  physicsProps: {
    density?: number;
    restitution?: number;
    friction?: number;
    isStatic?: boolean;
    frictionAir?: number;
  };
}

export interface GameState {
  currentLevelId: number | null;
  unlockedLevels: number[];
  levelStars: Record<number, StarsCount>;
  isSimulating: boolean;
  isPaused: boolean;
  placedBlocks: PlacedBlock[];
  selectedBlockType: BlockType | null;
  gameResult: GameResult;
  earnedStars: StarsCount;
}
