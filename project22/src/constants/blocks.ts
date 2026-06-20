import { BlockType, BlockProperties } from '@/types';

export const BLOCK_CONFIG: Record<BlockType, BlockProperties> = {
  [BlockType.AIR]: {
    id: BlockType.AIR,
    name: '空气',
    color: '#000000',
    hardness: 0,
    transparent: true,
  },
  [BlockType.GRASS]: {
    id: BlockType.GRASS,
    name: '草地',
    color: '#4CAF50',
    hardness: 0.6,
    transparent: false,
  },
  [BlockType.DIRT]: {
    id: BlockType.DIRT,
    name: '泥土',
    color: '#8B4513',
    hardness: 0.5,
    transparent: false,
  },
  [BlockType.STONE]: {
    id: BlockType.STONE,
    name: '石头',
    color: '#808080',
    hardness: 1.5,
    transparent: false,
  },
  [BlockType.WOOD]: {
    id: BlockType.WOOD,
    name: '木头',
    color: '#A0522D',
    hardness: 1.2,
    transparent: false,
  },
  [BlockType.LEAVES]: {
    id: BlockType.LEAVES,
    name: '树叶',
    color: '#228B22',
    hardness: 0.2,
    transparent: true,
  },
  [BlockType.SAND]: {
    id: BlockType.SAND,
    name: '沙子',
    color: '#F4D03F',
    hardness: 0.5,
    transparent: false,
  },
  [BlockType.WATER]: {
    id: BlockType.WATER,
    name: '水',
    color: '#4169E1',
    hardness: Infinity,
    transparent: true,
  },
  [BlockType.PLANKS]: {
    id: BlockType.PLANKS,
    name: '木板',
    color: '#DEB887',
    hardness: 1.0,
    transparent: false,
  },
  [BlockType.COBBLESTONE]: {
    id: BlockType.COBBLESTONE,
    name: '鹅卵石',
    color: '#696969',
    hardness: 1.5,
    transparent: false,
  },
};

export const HOTBAR_BLOCKS: BlockType[] = [
  BlockType.DIRT,
  BlockType.STONE,
  BlockType.WOOD,
  BlockType.PLANKS,
  BlockType.COBBLESTONE,
];

export const WORLD_SIZE = {
  width: 32,
  height: 32,
  depth: 32,
};

export const PLAYER_SIZE = {
  width: 0.6,
  height: 1.8,
  depth: 0.6,
};

export const GAME_CONFIG = {
  gravity: 20,
  jumpForce: 8,
  moveSpeed: 5,
  mouseSensitivity: 0.002,
  maxReach: 5,
  hungerDecreaseRate: 0.05,
  healthDecreaseRate: 0.1,
  healthRegenRate: 0.05,
  spawnPosition: { x: 0, y: 20, z: 0 },
};
