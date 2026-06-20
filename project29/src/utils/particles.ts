import type { Particle, Shockwave, Vector2 } from '../types/game';
import { add, scale, length as vecLength } from './vector2';

let particleIdCounter = 0;
let shockwaveIdCounter = 0;

export const createParticle = (
  position: Vector2,
  velocity: Vector2,
  color: string,
  size: number,
  life: number,
): Particle => ({
  id: particleIdCounter++,
  position: { ...position },
  velocity: { ...velocity },
  color,
  size,
  life,
  maxLife: life,
  decay: 1 / life,
});

export const createBurst = (
  position: Vector2,
  color: string,
  count: number = 16,
  speed: number = 4,
  sizeRange: [number, number] = [3, 7],
  lifeRange: [number, number] = [30, 60],
): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const s = speed * (0.6 + Math.random() * 0.8);
    const velocity = {
      x: Math.cos(angle) * s,
      y: Math.sin(angle) * s,
    };
    const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
    const life = Math.floor(lifeRange[0] + Math.random() * (lifeRange[1] - lifeRange[0]));
    particles.push(createParticle(position, velocity, color, size, life));
  }
  return particles;
};

export const createTrailParticle = (
  position: Vector2,
  color: string,
  velocity: Vector2,
): Particle => {
  const speed = vecLength(velocity);
  const backward = scale(velocity, speed > 0 ? -0.3 / Math.max(speed, 0.5) : 0);
  const jitter = {
    x: (Math.random() - 0.5) * 1.5,
    y: (Math.random() - 0.5) * 1.5,
  };
  return createParticle(
    add(position, add(backward, jitter)),
    { x: jitter.x * 0.3, y: jitter.y * 0.3 },
    color,
    2 + Math.random() * 3,
    18 + Math.floor(Math.random() * 10),
  );
};

export const createShockwave = (
  position: Vector2,
  color: string,
  maxRadius: number = 100,
  life: number = 28,
): Shockwave => ({
  id: shockwaveIdCounter++,
  position: { ...position },
  radius: 0,
  maxRadius,
  color,
  life,
  maxLife: life,
});

export const updateParticles = (particles: Particle[]): Particle[] => {
  return particles
    .map((p) => ({
      ...p,
      position: add(p.position, p.velocity),
      velocity: scale(p.velocity, 0.96),
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);
};

export const updateShockwaves = (shockwaves: Shockwave[]): Shockwave[] => {
  return shockwaves
    .map((s) => ({
      ...s,
      radius: s.radius + (s.maxRadius - s.radius) * 0.18,
      life: s.life - 1,
    }))
    .filter((s) => s.life > 0);
};
