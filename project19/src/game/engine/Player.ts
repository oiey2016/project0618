import { normalize, angleBetween } from '../utils/math';
import { Player as PlayerType, InputState, Wall } from '../types';
import { CollisionSystem } from './Collision';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

export class PlayerSystem {
  static update(
    player: PlayerType,
    input: InputState,
    walls: Wall[],
    isHiding: boolean,
    dt: number
  ): Partial<PlayerType> {
    if (isHiding) {
      return { velocityX: 0, velocityY: 0 };
    }

    let dx = 0;
    let dy = 0;

    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;

    const normalized = normalize(dx, dy);
    dx = normalized.x;
    dy = normalized.y;

    const moveX = dx * player.speed * dt;
    const moveY = dy * player.speed * dt;

    let newX = player.x + moveX;
    let newY = player.y + moveY;
    let newRotation = player.rotation;

    const testEntityX = { x: newX, y: player.y, width: player.width, height: player.height };
    if (CollisionSystem.checkWallCollision(testEntityX, walls)) {
      newX = player.x;
    }

    const testEntityY = { x: player.x, y: newY, width: player.width, height: player.height };
    if (CollisionSystem.checkWallCollision(testEntityY, walls)) {
      newY = player.y;
    }

    newX = Math.max(20, Math.min(MAP_WIDTH - player.width - 20, newX));
    newY = Math.max(20, Math.min(MAP_HEIGHT - player.height - 20, newY));

    if (dx !== 0 || dy !== 0) {
      newRotation = angleBetween(0, 0, dx, dy);
    }

    return {
      x: newX,
      y: newY,
      rotation: newRotation,
      velocityX: dx,
      velocityY: dy,
    };
  }
}
