import { BlockType, WorldMap } from '@/types';
import { WORLD_SIZE } from '@/constants/blocks';
import SimplexNoise from './noise';

export function getBlockKey(x: number, y: number, z: number): string {
  return `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
}

export function parseBlockKey(key: string): { x: number; y: number; z: number } {
  const [x, y, z] = key.split(',').map(Number);
  return { x, y, z };
}

export function generateTerrain(seed: number): WorldMap {
  const world = new Map<string, BlockType>();
  const noise = new SimplexNoise(seed);

  const { width, height, depth } = WORLD_SIZE;
  const halfWidth = Math.floor(width / 2);
  const halfDepth = Math.floor(depth / 2);

  for (let x = -halfWidth; x < halfWidth; x++) {
    for (let z = -halfDepth; z < halfDepth; z++) {
      const heightNoise = noise.octaveNoise2D(x * 0.05, z * 0.05, 4, 0.5);
      const surfaceY = Math.floor(10 + heightNoise * 8);

      for (let y = 0; y < height; y++) {
        const key = getBlockKey(x, y, z);

        if (y === 0) {
          world.set(key, BlockType.STONE);
        } else if (y === surfaceY) {
          if (y < 6) {
            world.set(key, BlockType.SAND);
          } else {
            world.set(key, BlockType.GRASS);
          }
        } else if (y < surfaceY && y > surfaceY - 4) {
          world.set(key, BlockType.DIRT);
        } else if (y < surfaceY - 3) {
          world.set(key, BlockType.STONE);
        } else if (y <= 5 && y > surfaceY) {
          world.set(key, BlockType.WATER);
        }
      }
    }
  }

  for (let x = -halfWidth; x < halfWidth; x++) {
    for (let z = -halfDepth; z < halfDepth; z++) {
      const treeChance = noise.noise2D(x * 0.2, z * 0.2);
      if (treeChance > 0.6) {
        const heightNoise = noise.octaveNoise2D(x * 0.05, z * 0.05, 4, 0.5);
        const surfaceY = Math.floor(10 + heightNoise * 8);

        if (surfaceY > 6) {
          generateTree(world, x, surfaceY + 1, z);
        }
      }
    }
  }

  return world;
}

function generateTree(world: WorldMap, x: number, y: number, z: number): void {
  const trunkHeight = 4 + Math.floor(Math.random() * 2);

  for (let i = 0; i < trunkHeight; i++) {
    const key = getBlockKey(x, y + i, z);
    if (!world.has(key)) {
      world.set(key, BlockType.WOOD);
    }
  }

  const leafStartY = y + trunkHeight - 1;
  for (let dy = -1; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        const dist = Math.sqrt(dx * dx + dz * dz + (dy * 0.5) * (dy * 0.5));
        if (dist < 2.5) {
          const key = getBlockKey(x + dx, leafStartY + dy, z + dz);
          if (!world.has(key)) {
            world.set(key, BlockType.LEAVES);
          }
        }
      }
    }
  }
}

export function findSpawnPosition(world: WorldMap): { x: number; y: number; z: number } {
  let spawnY = 0;
  for (let y = WORLD_SIZE.height - 1; y >= 0; y--) {
    const key = getBlockKey(0, y, 0);
    if (world.has(key)) {
      spawnY = y + 2;
      break;
    }
  }
  return { x: 0, y: spawnY, z: 0 };
}

export function isExposed(x: number, y: number, z: number, world: WorldMap): boolean {
  const directions = [
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1],
  ];

  for (const [dx, dy, dz] of directions) {
    const neighborKey = getBlockKey(x + dx, y + dy, z + dz);
    const neighborBlock = world.get(neighborKey);
    if (!neighborBlock || neighborBlock === BlockType.AIR) {
      return true;
    }
  }
  return false;
}
