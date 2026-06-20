import type { Vector2 } from '../types/game';

export const vec2 = (x: number, y: number): Vector2 => ({ x, y });

export const ZERO: Vector2 = { x: 0, y: 0 };

export const add = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const sub = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export const scale = (v: Vector2, s: number): Vector2 => ({
  x: v.x * s,
  y: v.y * s,
});

export const dot = (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y;

export const lengthSq = (v: Vector2): number => v.x * v.x + v.y * v.y;

export const length = (v: Vector2): number => Math.sqrt(lengthSq(v));

export const distanceSq = (a: Vector2, b: Vector2): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const distance = (a: Vector2, b: Vector2): number =>
  Math.sqrt(distanceSq(a, b));

export const normalize = (v: Vector2): Vector2 => {
  const len = length(v);
  if (len < 1e-8) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
};

export const clampLength = (v: Vector2, maxLen: number): Vector2 => {
  const lenSq = lengthSq(v);
  const maxSq = maxLen * maxLen;
  if (lenSq <= maxSq) return v;
  const factor = maxLen / Math.sqrt(lenSq);
  return { x: v.x * factor, y: v.y * factor };
};

export const lerp = (a: Vector2, b: Vector2, t: number): Vector2 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const reflect = (v: Vector2, normal: Vector2): Vector2 => {
  const d = 2 * dot(v, normal);
  return { x: v.x - d * normal.x, y: v.y - d * normal.y };
};
