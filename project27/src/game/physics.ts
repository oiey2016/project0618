import type { Platform } from './types';
import { GAME_CONFIG } from './constants';

export interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded?: boolean;
}

export function rectCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function applyGravity(
  body: PhysicsBody,
  platforms: Platform[],
  dtFactor: number = 1
): void {
  body.vy += GAME_CONFIG.gravity * dtFactor;

  body.x += body.vx * dtFactor;
  body.y += body.vy * dtFactor;

  if (body.isGrounded !== undefined) {
    body.isGrounded = false;
  }

  for (const platform of platforms) {
    if (
      body.x + body.width > platform.x &&
      body.x < platform.x + platform.width &&
      body.y + body.height > platform.y &&
      body.y + body.height < platform.y + platform.height + Math.abs(body.vy * dtFactor) + 1 &&
      body.vy >= 0
    ) {
      body.y = platform.y - body.height;
      body.vy = 0;
      if (body.isGrounded !== undefined) {
        body.isGrounded = true;
      }
    }
  }

  if (body.x < 0) {
    body.x = 0;
    body.vx = 0;
  }
  if (body.x + body.width > GAME_CONFIG.width) {
    body.x = GAME_CONFIG.width - body.width;
    body.vx = 0;
  }

  if (body.y + body.height > GAME_CONFIG.height) {
    body.y = GAME_CONFIG.height - body.height;
    body.vy = 0;
    if (body.isGrounded !== undefined) {
      body.isGrounded = true;
    }
  }
}

export function applyFriction(body: PhysicsBody, friction: number = 0.85): void {
  if (body.isGrounded) {
    body.vx *= friction;
    if (Math.abs(body.vx) < 0.1) {
      body.vx = 0;
    }
  }
}
