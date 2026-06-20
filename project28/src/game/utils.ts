import type { Particle, ShockWave, FloatingText } from './types';

let _id = 0;
export const nextId = () => `ent_${++_id}_${Date.now().toString(36)}`;

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function dist2(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

export function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(dist2(x1, y1, x2, y2));
}

export function normalize(x: number, y: number): { x: number; y: number } {
  const len = Math.sqrt(x * x + y * y);
  if (len < 0.0001) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

export function randRange(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

export function randInt(a: number, b: number): number {
  return Math.floor(randRange(a, b + 1));
}

export function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function spawnParticles(
  list: Particle[],
  x: number,
  y: number,
  count: number,
  color: string | string[],
  opts: Partial<Particle> = {},
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randRange(
      opts.type === 'confetti' ? 50 : 80,
      opts.type === 'confetti' ? 200 : 280,
    );
    const c = Array.isArray(color) ? randPick(color) : color;
    list.push({
      id: nextId(),
      x,
      y,
      vx: Math.cos(angle) * speed + (opts.vx ?? 0),
      vy: Math.sin(angle) * speed + (opts.vy ?? 0) - (opts.type === 'confetti' ? 100 : 0),
      life: opts.maxLife ?? randRange(400, 800),
      maxLife: opts.maxLife ?? 800,
      color: c,
      size: opts.size ?? randRange(2, 6),
      type: opts.type ?? 'circle',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: randRange(-6, 6),
    });
  }
}

export function spawnSparkBurst(
  list: Particle[],
  x: number,
  y: number,
  count: number,
  color: string,
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randRange(150, 400);
    list.push({
      id: nextId(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 300 + Math.random() * 300,
      maxLife: 600,
      color,
      size: randRange(1.5, 3.5),
      type: 'spark',
    });
  }
}

export function spawnShockWave(
  list: ShockWave[],
  x: number,
  y: number,
  maxRadius: number,
  color: string,
  duration = 500,
) {
  list.push({
    id: nextId(),
    x,
    y,
    radius: 0,
    maxRadius,
    color,
    life: duration,
    maxLife: duration,
  });
}

export function spawnFloatingText(
  list: FloatingText[],
  x: number,
  y: number,
  text: string,
  color: string,
  size = 20,
  duration = 900,
) {
  list.push({
    id: nextId(),
    x,
    y,
    vy: -60,
    life: duration,
    maxLife: duration,
    text,
    color,
    size,
  });
}

export function updateParticles(list: Particle[], dt: number): Particle[] {
  return list.filter((p) => {
    p.life -= dt;
    if (p.life <= 0) return false;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += (p.type === 'confetti' ? 400 : 0) * dt;
    p.vx *= 0.98;
    if (p.type !== 'confetti') p.vy *= 0.98;
    if (p.rotationSpeed !== undefined && p.rotation !== undefined) {
      p.rotation += p.rotationSpeed * dt;
    }
    return true;
  });
}

export function updateShockWaves(list: ShockWave[], dt: number): ShockWave[] {
  return list.filter((s) => {
    s.life -= dt;
    if (s.life <= 0) return false;
    const t = 1 - s.life / s.maxLife;
    s.radius = s.maxRadius * t;
    return true;
  });
}

export function updateFloatingTexts(list: FloatingText[], dt: number): FloatingText[] {
  return list.filter((t) => {
    t.life -= dt;
    if (t.life <= 0) return false;
    t.y += t.vy * dt;
    t.vy *= 0.95;
    return true;
  });
}
