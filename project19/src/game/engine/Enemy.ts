import { angleBetween, distance, normalize } from '../utils/math';
import { Enemy as EnemyType, Player, Wall, Point } from '../types';
import {
  ENEMY_SPEED_PATROL,
  ENEMY_SPEED_CHASE,
  ENEMY_SPEED_SEARCH,
  CHASE_DURATION_AFTER_LOST,
  SEARCH_DURATION,
} from '../constants';
import { CollisionSystem } from './Collision';

export class EnemySystem {
  static update(
    enemy: EnemyType,
    player: Player,
    walls: Wall[],
    isPlayerHiding: boolean,
    isChasing: boolean,
    dt: number
  ): { enemy: Partial<EnemyType>; spotted: boolean; caught: boolean } {
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    const playerSpotted = CollisionSystem.checkEnemySpotsPlayer(
      enemy,
      player,
      walls,
      isPlayerHiding
    );

    const playerCaught = CollisionSystem.checkCatchPlayer(enemy, player);

    if (playerCaught) {
      return { enemy: {}, spotted: true, caught: true };
    }

    let newState = enemy.state;
    let newSpeed = enemy.speed;
    let newSearchTimer = enemy.searchTimer;
    let newWaitTimer = enemy.waitTimer;
    let newLastSeenPos = enemy.lastSeenPlayerPos;
    let newPathIndex = enemy.currentPathIndex;

    if (playerSpotted) {
      newState = 'chase';
      newSpeed = ENEMY_SPEED_CHASE;
      newLastSeenPos = { x: playerCenterX, y: playerCenterY };
      newSearchTimer = CHASE_DURATION_AFTER_LOST;
    } else if (enemy.state === 'chase') {
      newSearchTimer -= dt * 1000;
      if (newSearchTimer <= 0) {
        newState = 'search';
        newSpeed = ENEMY_SPEED_SEARCH;
        newSearchTimer = SEARCH_DURATION;
      }
    } else if (enemy.state === 'search') {
      newSearchTimer -= dt * 1000;
      if (newSearchTimer <= 0) {
        newState = 'patrol';
        newSpeed = ENEMY_SPEED_PATROL;
        newLastSeenPos = null;
      }
    }

    let targetX: number;
    let targetY: number;

    if (newState === 'chase' && newLastSeenPos) {
      targetX = newLastSeenPos.x;
      targetY = newLastSeenPos.y;
    } else if (newState === 'search' && newLastSeenPos) {
      targetX = newLastSeenPos.x;
      targetY = newLastSeenPos.y;
      const distToSearchPos = distance(enemyCenterX, enemyCenterY, targetX, targetY);
      if (distToSearchPos < 40) {
        newWaitTimer -= dt * 1000;
        if (newWaitTimer <= 0) {
          newLastSeenPos = {
            x: newLastSeenPos.x + (Math.random() - 0.5) * 200,
            y: newLastSeenPos.y + (Math.random() - 0.5) * 200,
          };
          newWaitTimer = 1000 + Math.random() * 1000;
        }
      }
    } else {
      const target = enemy.patrolPath[newPathIndex];
      targetX = target.x;
      targetY = target.y;

      const distToTarget = distance(enemyCenterX, enemyCenterY, targetX, targetY);
      if (distToTarget < 30) {
        newWaitTimer -= dt * 1000;
        if (newWaitTimer <= 0) {
          newPathIndex = (newPathIndex + 1) % enemy.patrolPath.length;
          newWaitTimer = 500 + Math.random() * 1500;
        }
      }
    }

    const angleToTarget = angleBetween(enemyCenterX, enemyCenterY, targetX, targetY);
    const moveDir = normalize(Math.cos(angleToTarget), Math.sin(angleToTarget));

    let newX = enemy.x + moveDir.x * newSpeed * dt;
    let newY = enemy.y + moveDir.y * newSpeed * dt;

    const testEntityX = { x: newX, y: enemy.y, width: enemy.width, height: enemy.height };
    if (CollisionSystem.checkWallCollision(testEntityX, walls)) {
      newX = enemy.x;
    }

    const testEntityY = { x: enemy.x, y: newY, width: enemy.width, height: enemy.height };
    if (CollisionSystem.checkWallCollision(testEntityY, walls)) {
      newY = enemy.y;
    }

    return {
      enemy: {
        x: newX,
        y: newY,
        rotation: angleToTarget,
        state: newState,
        speed: newSpeed,
        searchTimer: newSearchTimer,
        waitTimer: newWaitTimer,
        lastSeenPlayerPos: newLastSeenPos,
        currentPathIndex: newPathIndex,
      },
      spotted: playerSpotted,
      caught: false,
    };
  }
}
