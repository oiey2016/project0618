import Matter from 'matter-js';
import { PhysicsWorld, WORLD_WIDTH, WORLD_HEIGHT } from './PhysicsWorld';
import { roundRect, drawGradientRect, drawCloud, drawMountain } from '@/utils/drawUtils';
import { ItemDefinition } from '@/data/items';

const LABEL_COLORS: Record<string, [string, string]> = {
  platform: ['#8B6914', '#6B4F10'],
  player: ['#FF8C42', '#E06A20'],
  goal: ['#4CAF50', '#2E7D32'],
  obstacle: ['#E53935', '#B71C1C'],
};

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = WORLD_WIDTH;
    this.height = WORLD_HEIGHT;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  drawBackground(ctx: CanvasRenderingContext2D, bgType: string = 'default') {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F7FA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    drawMountain(ctx, 50, this.height - 80, 250, 180);
    drawMountain(ctx, 300, this.height - 80, 300, 220);
    drawMountain(ctx, 650, this.height - 80, 280, 160);
    drawMountain(ctx, 900, this.height - 80, 260, 200);

    drawCloud(ctx, 100, 80, 60);
    drawCloud(ctx, 400, 50, 50);
    drawCloud(ctx, 750, 90, 55);
    drawCloud(ctx, 1050, 60, 45);
  }

  drawPlatform(ctx: CanvasRenderingContext2D, body: Matter.Body) {
    const pos = body.position;
    const bounds = body.bounds;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    const x = pos.x - w / 2;
    const y = pos.y - h / 2;
    const [c1, c2] = LABEL_COLORS.platform;
    drawGradientRect(ctx, x, y, w, h, c1, c2);
    ctx.strokeStyle = '#5A3E0A';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, w, h, 4);
    ctx.stroke();
  }

  drawPlayer(ctx: CanvasRenderingContext2D, body: Matter.Body) {
    const pos = body.position;
    const bounds = body.bounds;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    const bodyX = pos.x - w / 2;
    const bodyY = pos.y - h / 2;

    const [c1, c2] = LABEL_COLORS.player;
    drawGradientRect(ctx, bodyX, bodyY, w, h, c1, c2);
    ctx.strokeStyle = '#C0500A';
    ctx.lineWidth = 2;
    roundRect(ctx, bodyX, bodyY, w, h, 3);
    ctx.stroke();

    const headRadius = Math.min(w, h) * 0.35;
    const headX = pos.x;
    const headY = bodyY - headRadius * 0.5;

    ctx.fillStyle = '#FFCC80';
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C0500A';
    ctx.lineWidth = 2;
    ctx.stroke();

    const eyeOffsetX = headRadius * 0.3;
    const eyeOffsetY = -headRadius * 0.1;
    const eyeRadius = headRadius * 0.15;
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(headX - eyeOffsetX, headY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headX + eyeOffsetX, headY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGoal(ctx: CanvasRenderingContext2D, body: Matter.Body) {
    const pos = body.position;
    const bounds = body.bounds;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;

    const poleX = pos.x - w / 2 + 2;
    const poleBottom = pos.y + h / 2;
    const poleTop = poleBottom - h;

    ctx.fillStyle = '#795548';
    ctx.fillRect(poleX, poleTop, 4, h);
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(poleX, poleTop, 4, h);

    const [c1, c2] = LABEL_COLORS.goal;
    const gradient = ctx.createLinearGradient(poleX + 4, poleTop, poleX + 4 + w * 0.6, poleTop + h * 0.5);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(poleX + 4, poleTop);
    ctx.lineTo(poleX + 4 + w * 0.6, poleTop + h * 0.15);
    ctx.lineTo(poleX + 4, poleTop + h * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1B5E20';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawObstacle(ctx: CanvasRenderingContext2D, body: Matter.Body) {
    const pos = body.position;
    const bounds = body.bounds;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    const spikeCount = Math.max(1, Math.round(w / 15));
    const spikeWidth = w / spikeCount;

    const [c1, c2] = LABEL_COLORS.obstacle;
    const gradient = ctx.createLinearGradient(pos.x, pos.y - h, pos.x, pos.y + h / 2);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    ctx.fillStyle = gradient;

    const baseY = pos.y + h / 2;
    const tipY = pos.y - h / 2;

    ctx.beginPath();
    ctx.moveTo(pos.x - w / 2, baseY);
    for (let i = 0; i < spikeCount; i++) {
      const sx = pos.x - w / 2 + i * spikeWidth;
      ctx.lineTo(sx + spikeWidth / 2, tipY);
      ctx.lineTo(sx + spikeWidth, baseY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7F0000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawSpawnedItem(ctx: CanvasRenderingContext2D, body: Matter.Body) {
    const itemDef: ItemDefinition = (body as any).itemDef;
    if (!itemDef) return;

    const pos = body.position;
    const bounds = body.bounds;
    const w = bounds.max.x - bounds.min.x;
    const h = bounds.max.y - bounds.min.y;
    const x = pos.x - w / 2;
    const y = pos.y - h / 2;

    switch (itemDef.id) {
      case 'box': {
        drawGradientRect(ctx, x, y, w, h, '#A0522D', '#8B4513');
        ctx.strokeStyle = '#6B3410';
        ctx.lineWidth = 2;
        roundRect(ctx, x, y, w, h, 3);
        ctx.stroke();
        ctx.strokeStyle = '#7B4420';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.5, y + h);
        ctx.moveTo(x, y + h * 0.5);
        ctx.lineTo(x + w, y + h * 0.5);
        ctx.stroke();
        break;
      }
      case 'balloon': {
        const radius = Math.min(w, h) / 2;
        const gradient = ctx.createRadialGradient(
          pos.x - radius * 0.3, pos.y - radius * 0.3, radius * 0.1,
          pos.x, pos.y, radius
        );
        gradient.addColorStop(0, '#FF8A8A');
        gradient.addColorStop(1, '#FF6B6B');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#CC4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y + radius);
        ctx.lineTo(pos.x, pos.y + radius + 15);
        ctx.stroke();
        break;
      }
      case 'spring': {
        const zigCount = 6;
        const segW = w / zigCount;
        const halfH = h / 2;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, pos.y);
        for (let i = 0; i < zigCount; i++) {
          const sx = x + i * segW;
          const topOrBottom = i % 2 === 0 ? -1 : 1;
          ctx.lineTo(sx + segW / 2, pos.y + topOrBottom * halfH);
          ctx.lineTo(sx + segW, pos.y);
        }
        ctx.stroke();
        ctx.fillStyle = '#FFA000';
        ctx.fillRect(x, y, w, 4);
        ctx.fillRect(x, y + h - 4, w, 4);
        break;
      }
      case 'bridge': {
        drawGradientRect(ctx, x, y, w, h, '#DEB887', '#C8A870');
        ctx.strokeStyle = '#A08050';
        ctx.lineWidth = 2;
        roundRect(ctx, x, y, w, h, 2);
        ctx.stroke();
        ctx.strokeStyle = '#B89860';
        ctx.lineWidth = 1;
        const plankCount = Math.floor(w / 20);
        for (let i = 1; i < plankCount; i++) {
          const lx = x + i * (w / plankCount);
          ctx.beginPath();
          ctx.moveTo(lx, y);
          ctx.lineTo(lx, y + h);
          ctx.stroke();
        }
        break;
      }
      case 'wall': {
        drawGradientRect(ctx, x, y, w, h, '#808080', '#666666');
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        roundRect(ctx, x, y, w, h, 2);
        ctx.stroke();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        const brickH = 12;
        const brickW = w;
        const rows = Math.floor(h / brickH);
        for (let r = 1; r < rows; r++) {
          const ly = y + r * brickH;
          ctx.beginPath();
          ctx.moveTo(x, ly);
          ctx.lineTo(x + w, ly);
          ctx.stroke();
          const offset = r % 2 === 0 ? 0 : brickW / 2;
          for (let c = offset; c < w; c += brickW) {
            ctx.beginPath();
            ctx.moveTo(x + c, ly - brickH);
            ctx.lineTo(x + c, ly);
            ctx.stroke();
          }
        }
        break;
      }
      case 'fan': {
        const halfW = w / 2;
        const halfH = h / 2;
        ctx.fillStyle = '#4FC3F7';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - halfH);
        ctx.lineTo(pos.x + halfW, pos.y + halfH);
        ctx.lineTo(pos.x - halfW, pos.y + halfH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0288D1';
        ctx.lineWidth = 2;
        ctx.stroke();
        const angle = (Date.now() / 200) % (Math.PI * 2);
        const bladeLen = Math.min(w, h) * 0.3;
        for (let i = 0; i < 3; i++) {
          const a = angle + (i * Math.PI * 2 / 3);
          const bx = pos.x + Math.cos(a) * bladeLen;
          const by = pos.y + Math.sin(a) * bladeLen;
          ctx.strokeStyle = '#0288D1';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
        ctx.fillStyle = '#0288D1';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'ice': {
        ctx.fillStyle = 'rgba(179, 229, 252, 0.7)';
        roundRect(ctx, x, y, w, h, 3);
        ctx.fill();
        ctx.strokeStyle = '#81D4FA';
        ctx.lineWidth = 2;
        roundRect(ctx, x, y, w, h, 3);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.2, y + h * 0.3);
        ctx.lineTo(x + w * 0.4, y + h * 0.3);
        ctx.lineTo(x + w * 0.25, y + h * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x + w * 0.65, y + h * 0.4, w * 0.12, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      default: {
        drawGradientRect(ctx, x, y, w, h, itemDef.color, itemDef.color);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        roundRect(ctx, x, y, w, h, 3);
        ctx.stroke();
      }
    }
  }

  render(world: PhysicsWorld) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const bodies = world.getBodies();
    for (const body of bodies) {
      this.drawBody(ctx, body);
    }
  }

  private drawBody(ctx: CanvasRenderingContext2D, body: Matter.Body) {
    const label = body.label || '';

    if (label === 'platform') {
      this.drawPlatform(ctx, body);
    } else if (label === 'player') {
      this.drawPlayer(ctx, body);
    } else if (label === 'goal') {
      this.drawGoal(ctx, body);
    } else if (label === 'obstacle') {
      this.drawObstacle(ctx, body);
    } else if (label === 'spawnedItem') {
      this.drawSpawnedItem(ctx, body);
    }
  }
}
