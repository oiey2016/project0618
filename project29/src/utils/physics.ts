import type { Player, Vector2, GameConfig } from '../types/game';
import {
  add,
  sub,
  scale,
  normalize,
  distance,
  clampLength,
  dot,
  length as vecLength,
} from './vector2';

export interface CollisionResult {
  collided: boolean;
  collisionPoint: Vector2 | null;
  impactForce: number;
}

export const updatePlayerMovement = (
  player: Player,
  config: GameConfig,
  deltaFactor: number = 1,
): Player => {
  const input = player.inputDirection;
  const inputLen = vecLength(input);

  let velocity = { ...player.velocity };

  if (inputLen > 1e-6) {
    const inputNorm = scale(input, 1 / inputLen);
    const accel = scale(inputNorm, config.acceleration * deltaFactor);
    velocity = add(velocity, accel);
  }

  velocity = scale(velocity, Math.pow(config.friction, deltaFactor));
  velocity = clampLength(velocity, config.maxSpeed);

  const position = add(player.position, scale(velocity, deltaFactor));

  let trail = [...player.trail, { ...player.position }];
  if (trail.length > config.trailLength) {
    trail = trail.slice(trail.length - config.trailLength);
  }

  return {
    ...player,
    position,
    velocity,
    trail,
  };
};

export const resolvePlayerCollision = (
  p1: Player,
  p2: Player,
  config: GameConfig,
): { p1: Player; p2: Player; result: CollisionResult } => {
  const dist = distance(p1.position, p2.position);
  const minDist = p1.radius + p2.radius;

  const result: CollisionResult = {
    collided: false,
    collisionPoint: null,
    impactForce: 0,
  };

  if (dist >= minDist || dist < 1e-6) {
    return { p1, p2, result };
  }

  result.collided = true;

  const overlap = minDist - dist;
  const normal = scale(sub(p2.position, p1.position), 1 / dist);

  const posCorrection = scale(normal, overlap * 0.5);
  let newP1Pos = sub(p1.position, posCorrection);
  let newP2Pos = add(p2.position, posCorrection);

  const v1n = dot(p1.velocity, normal);
  const v2n = dot(p2.velocity, normal);
  const relVelNormal = v1n - v2n;

  result.impactForce = Math.abs(relVelNormal);
  result.collisionPoint = {
    x: p1.position.x + normal.x * p1.radius,
    y: p1.position.y + normal.y * p1.radius,
  };

  if (relVelNormal > 0) {
    const impulse = (-(1 + config.restitution) * relVelNormal) / 2;
    const impulseVec = scale(normal, impulse * config.pushForce);

    const newP1Vel = add(p1.velocity, impulseVec);
    const newP2Vel = sub(p2.velocity, impulseVec);

    return {
      p1: { ...p1, position: newP1Pos, velocity: clampLength(newP1Vel, config.maxSpeed * 1.4) },
      p2: { ...p2, position: newP2Pos, velocity: clampLength(newP2Vel, config.maxSpeed * 1.4) },
      result,
    };
  }

  return {
    p1: { ...p1, position: newP1Pos },
    p2: { ...p2, position: newP2Pos },
    result,
  };
};

export const getDistanceFromCenter = (
  position: Vector2,
  center: Vector2,
): number => distance(position, center);

export const isPlayerOutOfBounds = (
  position: Vector2,
  playerRadius: number,
  arenaRadius: number,
  center: Vector2,
  threshold: number = 4,
): boolean => {
  const dist = distance(position, center);
  return dist > arenaRadius - playerRadius + threshold;
};

export const getDangerLevel = (
  position: Vector2,
  playerRadius: number,
  arenaRadius: number,
  center: Vector2,
  dangerZoneRatio: number,
): number => {
  const dist = distance(position, center);
  const safeRadius = arenaRadius * dangerZoneRatio - playerRadius;
  const dangerRadius = arenaRadius - playerRadius;

  if (dist <= safeRadius) return 0;
  if (dist >= dangerRadius) return 1;
  return (dist - safeRadius) / (dangerRadius - safeRadius);
};

export const getEdgeAngle = (
  position: Vector2,
  center: Vector2,
): number => {
  const dx = position.x - center.x;
  const dy = position.y - center.y;
  return Math.atan2(dy, dx);
};
