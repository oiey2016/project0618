import { Note, HitEffect, Particle, JudgementType } from '@/game/types';
import { GAME_CONFIG } from '@/game/config';
import { degToRad } from '@/utils/math';

interface RendererOptions {
  canvas: HTMLCanvasElement;
}

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private centerX: number = 0;
  private centerY: number = 0;
  private radius: number = 0;
  private width: number = 0;
  private height: number = 0;
  private stars: { x: number; y: number; size: number; speed: number; alpha: number }[] = [];
  private time: number = 0;

  constructor(options: RendererOptions) {
    this.canvas = options.canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
    this.resize();
    this.initStars();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.centerX = rect.width / 2;
    this.centerY = rect.height / 2;
    this.radius = Math.min(rect.width, rect.height) * 0.38;

    this.initStars();
  }

  private initStars() {
    this.stars = [];
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
  }

  render(
    pointerAngle: number,
    notes: Note[],
    hitEffects: HitEffect[],
    particles: Particle[],
    deltaTime: number
  ) {
    this.time += deltaTime;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawBackground();
    this.drawStars(deltaTime);
    this.drawJudgeCircles();
    this.drawNotes(notes);
    this.drawPointer(pointerAngle);
    this.drawHitEffects(hitEffects);
    this.drawParticles(particles);
    this.drawOuterGlow();
  }

  private drawBackground() {
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, Math.max(this.width, this.height) * 0.7
    );
    gradient.addColorStop(0, '#132F4C');
    gradient.addColorStop(0.5, '#0A1929');
    gradient.addColorStop(1, '#000A14');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawStars(deltaTime: number) {
    this.stars.forEach(star => {
      star.alpha += Math.sin(this.time * star.speed * 2) * 0.01;
      star.alpha = Math.max(0.1, Math.min(0.8, star.alpha));

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      this.ctx.fill();
    });
  }

  private drawJudgeCircles() {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;

    for (let i = 3; i >= 1; i--) {
      const r = this.radius * (i / 3);
      const alpha = 0.1 + (3 - i) * 0.05;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79, 195, 247, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const hitRadius = GAME_CONFIG.hitRadius * (this.radius / 200);

    const glowGradient = ctx.createRadialGradient(
      cx, cy, hitRadius * 0.8,
      cx, cy, hitRadius * 1.2
    );
    glowGradient.addColorStop(0, 'rgba(79, 195, 247, 0)');
    glowGradient.addColorStop(0.5, 'rgba(79, 195, 247, 0.1)');
    glowGradient.addColorStop(1, 'rgba(79, 195, 247, 0)');

    ctx.beginPath();
    ctx.arc(cx, cy, hitRadius * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, hitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.6)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#4FC3F7';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#4FC3F7';
    ctx.shadowColor = '#4FC3F7';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  private drawNotes(notes: Note[]) {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;
    const scale = this.radius / 200;

    notes.forEach(note => {
      if (note.hit && note.judgement) return;
      if (note.distance < -50 || note.distance > GAME_CONFIG.spawnDistance + 50) return;

      const angleRad = degToRad(note.angle);
      const distanceScaled = note.distance * scale;
      const x = cx + Math.cos(angleRad) * distanceScaled;
      const y = cy + Math.sin(angleRad) * distanceScaled;

      const sizeScale = Math.max(0.3, Math.min(1.2, 1 - note.distance / GAME_CONFIG.spawnDistance + 0.3));
      const noteSize = note.size * sizeScale * scale * 1.5;

      const color = GAME_CONFIG.noteColors[note.type];

      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, noteSize * 2);
      glowGradient.addColorStop(0, color + '80');
      glowGradient.addColorStop(0.5, color + '30');
      glowGradient.addColorStop(1, color + '00');

      ctx.beginPath();
      ctx.arc(x, y, noteSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      const bodyGradient = ctx.createRadialGradient(
        x - noteSize * 0.3, y - noteSize * 0.3, 0,
        x, y, noteSize
      );
      bodyGradient.addColorStop(0, '#ffffff');
      bodyGradient.addColorStop(0.3, color);
      bodyGradient.addColorStop(1, color + 'AA');

      ctx.beginPath();
      ctx.arc(x, y, noteSize, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(x - noteSize * 0.3, y - noteSize * 0.3, noteSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    });
  }

  private drawPointer(angle: number) {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;
    const pointerLength = this.radius * 0.95;
    const angleRad = degToRad(angle);

    const endX = cx + Math.cos(angleRad) * pointerLength;
    const endY = cy + Math.sin(angleRad) * pointerLength;

    const trailCount = 8;
    for (let i = trailCount; i >= 1; i--) {
      const trailRatio = i / trailCount;
      const trailLength = pointerLength * (0.3 + trailRatio * 0.7);
      const trailX = cx + Math.cos(angleRad) * trailLength;
      const trailY = cy + Math.sin(angleRad) * trailLength;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(trailX, trailY);
      ctx.strokeStyle = `rgba(79, 195, 247, ${trailRatio * 0.15})`;
      ctx.lineWidth = 8 * trailRatio;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#4FC3F7';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#4FC3F7';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#4FC3F7';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#4FC3F7';
    ctx.fill();
  }

  private drawHitEffects(effects: HitEffect[]) {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;
    const now = performance.now();
    const scale = this.radius / 200;

    effects.forEach(effect => {
      const progress = (now - effect.startTime) / effect.duration;
      if (progress >= 1) return;

      const angleRad = degToRad(effect.angle);
      const hitDistance = GAME_CONFIG.hitRadius * scale;
      const x = cx + Math.cos(angleRad) * hitDistance;
      const y = cy + Math.sin(angleRad) * hitDistance;

      const baseColor = effect.type === 'miss'
        ? '#F48FB1'
        : GAME_CONFIG.judgement[effect.type as Exclude<JudgementType, 'miss' | null>]?.color || '#4FC3F7';

      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringProgress = (progress + i * 0.15) % 1;
        const ringSize = 20 + ringProgress * 80 * scale;
        const alpha = (1 - ringProgress) * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, ringSize, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 3 * (1 - ringProgress);
        ctx.stroke();
      }

      if (effect.type && effect.type !== 'miss') {
        const textY = y - 30 - progress * 40;
        const textAlpha = 1 - progress;

        ctx.font = 'bold 16px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = baseColor + Math.floor(textAlpha * 255).toString(16).padStart(2, '0');
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 10;
        ctx.fillText(effect.type.toUpperCase(), x, textY);
        ctx.shadowBlur = 0;
      }
    });
  }

  private drawParticles(particles: Particle[]) {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;
    const scale = this.radius / 200;

    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const size = particle.size * scale * alpha;

      ctx.beginPath();
      ctx.arc(cx + particle.x * scale, cy + particle.y * scale, size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  private drawOuterGlow() {
    const ctx = this.ctx;
    const cx = this.centerX;
    const cy = this.centerY;

    const gradient = ctx.createRadialGradient(
      cx, cy, this.radius * 0.9,
      cx, cy, this.radius * 1.3
    );
    gradient.addColorStop(0, 'rgba(79, 195, 247, 0)');
    gradient.addColorStop(0.5, 'rgba(79, 195, 247, 0.05)');
    gradient.addColorStop(1, 'rgba(79, 195, 247, 0)');

    ctx.beginPath();
    ctx.arc(cx, cy, this.radius * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  getCenter() {
    return { x: this.centerX, y: this.centerY };
  }

  getRadius() {
    return this.radius;
  }
}
