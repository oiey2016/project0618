import { Point, Entity } from '../types';

export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const distanceBetweenEntities = (a: Entity, b: Entity): number => {
  return distance(a.x + a.width / 2, a.y + a.height / 2, b.x + b.width / 2, b.y + b.height / 2);
};

export const normalize = (x: number, y: number): { x: number; y: number } => {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
};

export const angleBetween = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const angleDiff = (a: number, b: number): number => {
  let diff = a - b;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return Math.abs(diff);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const aabbCollision = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean => {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

export const isInViewCone = (
  observerX: number,
  observerY: number,
  observerAngle: number,
  targetX: number,
  targetY: number,
  viewDistance: number,
  viewAngle: number
): boolean => {
  const dist = distance(observerX, observerY, targetX, targetY);
  if (dist > viewDistance) return false;
  
  const angleToTarget = angleBetween(observerX, observerY, targetX, targetY);
  const diff = angleDiff(angleToTarget, observerAngle);
  
  return diff <= viewAngle / 2;
};

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const pointToLineDistance = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) param = dot / lenSq;
  
  let xx, yy;
  
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  return distance(px, py, xx, yy);
};

export const checkLineOfSight = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  walls: { x: number; y: number; width: number; height: number }[]
): boolean => {
  for (const wall of walls) {
    const corners = [
      { x: wall.x, y: wall.y },
      { x: wall.x + wall.width, y: wall.y },
      { x: wall.x, y: wall.y + wall.height },
      { x: wall.x + wall.width, y: wall.y + wall.height },
    ];
    
    const edges = [
      [corners[0], corners[1]],
      [corners[1], corners[3]],
      [corners[3], corners[2]],
      [corners[2], corners[0]],
    ];
    
    for (const [p1, p2] of edges) {
      if (lineIntersectsLine(x1, y1, x2, y2, p1.x, p1.y, p2.x, p2.y)) {
        return false;
      }
    }
  }
  return true;
};

const lineIntersectsLine = (
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean => {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return false;
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
};
