import { aabbCollision, isInViewCone, distance, checkLineOfSight } from '../utils/math';
import { Player, Enemy, Key, HidingSpot, Wall } from '../types';

export class CollisionSystem {
  static checkWallCollision(
    entity: { x: number; y: number; width: number; height: number },
    walls: Wall[]
  ): Wall | null {
    for (const wall of walls) {
      if (aabbCollision(entity, wall)) {
        return wall;
      }
    }
    return null;
  }

  static checkKeyCollection(
    player: Player,
    keys: Key[]
  ): Key | null {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    for (const key of keys) {
      if (key.collected) continue;
      
      const keyCenterX = key.x + key.width / 2;
      const keyCenterY = key.y + key.height / 2;
      
      const dist = distance(playerCenterX, playerCenterY, keyCenterX, keyCenterY);
      if (dist < 35) {
        return key;
      }
    }
    return null;
  }

  static checkNearbyHidingSpot(
    player: Player,
    hidingSpots: HidingSpot[]
  ): HidingSpot | null {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    let nearest: HidingSpot | null = null;
    let nearestDist = Infinity;

    for (const spot of hidingSpots) {
      if (spot.occupied) continue;
      
      const spotCenterX = spot.x + spot.width / 2;
      const spotCenterY = spot.y + spot.height / 2;
      
      const dist = distance(playerCenterX, playerCenterY, spotCenterX, spotCenterY);
      if (dist < 50 && dist < nearestDist) {
        nearestDist = dist;
        nearest = spot;
      }
    }
    return nearest;
  }

  static checkEnemySpotsPlayer(
    enemy: Enemy,
    player: Player,
    walls: Wall[],
    isPlayerHiding: boolean
  ): boolean {
    if (isPlayerHiding) return false;

    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    const inView = isInViewCone(
      enemyCenterX,
      enemyCenterY,
      enemy.rotation,
      playerCenterX,
      playerCenterY,
      enemy.viewDistance,
      enemy.viewAngle
    );

    if (!inView) return false;

    return checkLineOfSight(
      enemyCenterX,
      enemyCenterY,
      playerCenterX,
      playerCenterY,
      walls
    );
  }

  static checkCatchPlayer(enemy: Enemy, player: Player): boolean {
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    const dist = distance(enemyCenterX, enemyCenterY, playerCenterX, playerCenterY);
    return dist < 35;
  }

  static checkAtDoor(
    player: Player,
    door: { x: number; y: number; width: number; height: number }
  ): boolean {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const doorCenterX = door.x + door.width / 2;
    const doorCenterY = door.y + door.height / 2;

    const dist = distance(playerCenterX, playerCenterY, doorCenterX, doorCenterY);
    return dist < 50;
  }
}
