import { WorldMap, BlockType } from '@/types';
import { getBlockKey } from './terrain';
import { PLAYER_SIZE } from '@/constants/blocks';

export interface AABB {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export function getPlayerAABB(
  position: { x: number; y: number; z: number }
): AABB {
  const halfWidth = PLAYER_SIZE.width / 2;
  const halfDepth = PLAYER_SIZE.depth / 2;

  return {
    minX: position.x - halfWidth,
    maxX: position.x + halfWidth,
    minY: position.y,
    maxY: position.y + PLAYER_SIZE.height,
    minZ: position.z - halfDepth,
    maxZ: position.z + halfDepth,
  };
}

export function getBlockAABB(
  x: number,
  y: number,
  z: number
): AABB {
  return {
    minX: Math.floor(x),
    maxX: Math.floor(x) + 1,
    minY: Math.floor(y),
    maxY: Math.floor(y) + 1,
    minZ: Math.floor(z),
    maxZ: Math.floor(z) + 1,
  };
}

export function checkAABBCollision(a: AABB, b: AABB): boolean {
  return (
    a.minX < b.maxX &&
    a.maxX > b.minX &&
    a.minY < b.maxY &&
    a.maxY > b.minY &&
    a.minZ < b.maxZ &&
    a.maxZ > b.minZ
  );
}

export function isSolidBlock(
  x: number,
  y: number,
  z: number,
  world: WorldMap
): boolean {
  const key = getBlockKey(x, y, z);
  const blockType = world.get(key);
  return !!blockType && blockType !== BlockType.AIR && blockType !== BlockType.WATER;
}

export function checkCollision(
  position: { x: number; y: number; z: number },
  world: WorldMap
): boolean {
  const playerAABB = getPlayerAABB(position);

  const minBlockX = Math.floor(playerAABB.minX) - 1;
  const maxBlockX = Math.floor(playerAABB.maxX) + 1;
  const minBlockY = Math.floor(playerAABB.minY) - 1;
  const maxBlockY = Math.floor(playerAABB.maxY) + 1;
  const minBlockZ = Math.floor(playerAABB.minZ) - 1;
  const maxBlockZ = Math.floor(playerAABB.maxZ) + 1;

  for (let x = minBlockX; x <= maxBlockX; x++) {
    for (let y = minBlockY; y <= maxBlockY; y++) {
      for (let z = minBlockZ; z <= maxBlockZ; z++) {
        if (isSolidBlock(x, y, z, world)) {
          const blockAABB = getBlockAABB(x, y, z);
          if (checkAABBCollision(playerAABB, blockAABB)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function resolveAxisCollision(
  position: { x: number; y: number; z: number },
  world: WorldMap,
  axis: 'x' | 'y' | 'z',
  delta: number
): { position: { x: number; y: number; z: number }; collided: boolean } {
  const newPosition = { ...position };
  newPosition[axis] += delta;

  if (!checkCollision(newPosition, world)) {
    return { position: newPosition, collided: false };
  }

  const step = delta > 0 ? 0.01 : -0.01;
  let currentDelta = 0;
  let collided = false;

  while (Math.abs(currentDelta) < Math.abs(delta)) {
    const testPosition = { ...position };
    testPosition[axis] += currentDelta + step;

    if (checkCollision(testPosition, world)) {
      collided = true;
      break;
    }

    currentDelta += step;
    newPosition[axis] = position[axis] + currentDelta;
  }

  return { position: newPosition, collided };
}

export function applyGravityAndGround(
  position: { x: number; y: number; z: number },
  velocityY: number,
  world: WorldMap,
  deltaTime: number
): { position: { x: number; y: number; z: number }; velocityY: number; onGround: boolean } {
  const newVelocityY = velocityY - 20 * deltaTime;
  
  const result = resolveAxisCollision(position, world, 'y', newVelocityY * deltaTime);
  
  let onGround = false;
  if (result.collided && newVelocityY < 0) {
    onGround = true;
    return { position: result.position, velocityY: 0, onGround };
  }

  return { position: result.position, velocityY: newVelocityY, onGround };
}
