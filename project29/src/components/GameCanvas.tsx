import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getDangerLevel, getEdgeAngle } from '../utils/physics';
import { length as vecLength } from '../utils/vector2';

interface GameCanvasProps {
  className?: string;
}

export const GameCanvas = ({ className = '' }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    t: 0,
  });

  const canvasSize = useGameStore((s) => s.canvasSize);
  const arenaCenter = useGameStore((s) => s.arenaCenter);
  const arenaRadius = useGameStore((s) => s.config.arenaRadius);
  const dangerZoneRatio = useGameStore((s) => s.config.dangerZoneRatio);
  const players = useGameStore((s) => s.players);
  const particles = useGameStore((s) => s.particles);
  const shockwaves = useGameStore((s) => s.shockwaves);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let frameId = 0;

    const render = () => {
      stateRef.current.t += 1;
      const time = stateRef.current.t;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      drawBackgroundGlow(ctx, canvasSize, time);
      drawArena(ctx, arenaCenter, arenaRadius, dangerZoneRatio, players, time);
      drawShockwaves(ctx, shockwaves);
      drawParticles(ctx, particles);
      drawPlayerTrail(ctx, players.P1);
      drawPlayerTrail(ctx, players.P2);
      drawPlayer(ctx, players.P1, arenaCenter, arenaRadius);
      drawPlayer(ctx, players.P2, arenaCenter, arenaRadius);
      drawVignette(ctx, canvasSize);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [canvasSize, arenaCenter, arenaRadius, dangerZoneRatio, players, particles, shockwaves, phase]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="block rounded-3xl"
        style={{
          boxShadow:
            '0 0 0 1px rgba(148,163,184,0.08), 0 40px 80px -20px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
};

const drawBackgroundGlow = (
  ctx: CanvasRenderingContext2D,
  size: number,
  time: number,
) => {
  const cx = size / 2;
  const cy = size / 2;
  const pulse = Math.sin(time * 0.02) * 0.08 + 1;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.6 * pulse);
  grad.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
  grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.03)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
};

const drawArena = (
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  radius: number,
  dangerZoneRatio: number,
  players: Record<'P1' | 'P2', any>,
  time: number,
) => {
  const maxDanger = Math.max(
    getDangerLevel(players.P1.position, players.P1.radius, radius, center, dangerZoneRatio),
    getDangerLevel(players.P2.position, players.P2.radius, radius, center, dangerZoneRatio),
  );

  ctx.save();
  ctx.shadowColor = maxDanger > 0.4 ? `rgba(239, 68, 68, ${0.3 + maxDanger * 0.5})` : 'rgba(59, 130, 246, 0.35)';
  ctx.shadowBlur = 30 + maxDanger * 30 + Math.sin(time * 0.06) * 6;

  const platformGrad = ctx.createRadialGradient(
    center.x,
    center.y,
    0,
    center.x,
    center.y,
    radius,
  );
  platformGrad.addColorStop(0, '#1e293b');
  platformGrad.addColorStop(0.7, '#1a2538');
  platformGrad.addColorStop(1, '#0f1a2e');

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = platformGrad;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    const r = (radius * i) / 6;
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + time * 0.002;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(
      center.x + Math.cos(angle) * radius,
      center.y + Math.sin(angle) * radius,
    );
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(30, 64, 175, 0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const dangerR = radius * dangerZoneRatio;
  const dangerGrad = ctx.createRadialGradient(
    center.x,
    center.y,
    dangerR,
    center.x,
    center.y,
    radius,
  );
  dangerGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
  dangerGrad.addColorStop(1, `rgba(239, 68, 68, ${0.08 + maxDanger * 0.22})`);
  ctx.fillStyle = dangerGrad;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();

  [players.P1, players.P2].forEach((p) => {
    if (!p.isAlive) return;
    const dLevel = getDangerLevel(p.position, p.radius, radius, center, dangerZoneRatio);
    if (dLevel > 0.3) {
      const angle = getEdgeAngle(p.position, center);
      const blink = (Math.sin(time * 0.4) + 1) / 2;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + dLevel * 0.5 * blink})`;
      ctx.lineWidth = 4 + dLevel * 4;
      ctx.beginPath();
      ctx.arc(
        center.x,
        center.y,
        radius - 2,
        angle - 0.5 - dLevel * 0.3,
        angle + 0.5 + dLevel * 0.3,
      );
      ctx.stroke();
    }
  });

  ctx.restore();

  const borderGrad = ctx.createRadialGradient(
    center.x,
    center.y,
    radius - 4,
    center.x,
    center.y,
    radius + 8,
  );
  borderGrad.addColorStop(0, maxDanger > 0.5 ? `rgba(248, 113, 113, ${0.5 + Math.sin(time * 0.15) * 0.2})` : 'rgba(96, 165, 250, 0.4)');
  borderGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.15)');
  borderGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius + 8, 0, Math.PI * 2);
  ctx.arc(center.x, center.y, radius - 4, 0, Math.PI * 2, true);
  ctx.fillStyle = borderGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();
};

const drawPlayerTrail = (
  ctx: CanvasRenderingContext2D,
  player: any,
) => {
  if (player.trail.length < 2) return;

  ctx.save();
  for (let i = 1; i < player.trail.length; i++) {
    const t = i / player.trail.length;
    const alpha = t * 0.5;
    const size = player.radius * (0.25 + t * 0.6);
    const pos = player.trail[i];

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.fillStyle = player.glowColor;
    ctx.fill();
  }
  ctx.restore();
};

const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: any,
  arenaCenter: { x: number; y: number },
  arenaRadius: number,
) => {
  const { x, y } = player.position;
  const r = player.radius;
  const speed = vecLength(player.velocity);
  const alive = player.isAlive;

  const distFromCenter = Math.sqrt((x - arenaCenter.x) ** 2 + (y - arenaCenter.y) ** 2);
  const maxDist = arenaRadius - r;
  const edgeRatio = Math.min(distFromCenter / Math.max(maxDist, 1), 1.5);
  const shadowScale = Math.max(0.5, 1 - edgeRatio * 0.5);

  ctx.save();

  if (alive) {
    const glowR = r + 12 + speed * 1.5;
    const glow = ctx.createRadialGradient(x, y, r * 0.4, x, y, glowR);
    glow.addColorStop(0, player.glowColor + '66');
    glow.addColorStop(0.4, player.glowColor + '22');
    glow.addColorStop(1, player.glowColor + '00');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowColor = player.color;
  ctx.shadowBlur = alive ? 16 + speed * 2 : 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const bodyGrad = ctx.createRadialGradient(
    x - r * 0.35,
    y - r * 0.35,
    r * 0.1,
    x,
    y,
    r,
  );
  if (alive) {
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.25, player.glowColor);
    bodyGrad.addColorStop(0.7, player.color);
    bodyGrad.addColorStop(1, player.darkColor);
  } else {
    bodyGrad.addColorStop(0, '#475569');
    bodyGrad.addColorStop(1, '#1e293b');
  }

  ctx.beginPath();
  ctx.arc(x, y, r * shadowScale, 0, Math.PI * 2);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = alive ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.15)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - r * 0.45, y - r * 0.5, r * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = alive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, r * 0.96, 0, Math.PI * 2);
  ctx.strokeStyle = alive ? player.darkColor : '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (alive && speed > 0.4) {
    const dir = { x: player.velocity.x / speed, y: player.velocity.y / speed };
    const arrowLen = r * 0.75;
    const tipX = x + dir.x * (r + arrowLen * 0.5);
    const tipY = y + dir.y * (r + arrowLen * 0.5);
    const baseX = x + dir.x * (r + 2);
    const baseY = y + dir.y * (r + 2);
    const perpX = -dir.y;
    const perpY = dir.x;

    ctx.strokeStyle = player.glowColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(baseX + perpX * 6, baseY + perpY * 6);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(baseX - perpX * 6, baseY - perpY * 6);
    ctx.stroke();
  }

  ctx.fillStyle = alive ? '#ffffff' : '#64748b';
  ctx.font = `bold ${Math.floor(r * 0.65)}px Orbitron, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(player.id === 'P1' ? '1' : '2', x, y + 1);

  ctx.restore();
};

const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particles: any[],
) => {
  ctx.save();
  for (const p of particles) {
    const alpha = Math.min(1, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 2;
    ctx.beginPath();
    ctx.arc(p.position.x, p.position.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

const drawShockwaves = (
  ctx: CanvasRenderingContext2D,
  shockwaves: any[],
) => {
  ctx.save();
  for (const s of shockwaves) {
    const alpha = s.life / s.maxLife;
    ctx.globalAlpha = alpha * 0.8;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 3 * alpha + 0.5;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(s.position.x, s.position.y, s.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
};

const drawVignette = (
  ctx: CanvasRenderingContext2D,
  size: number,
) => {
  const cx = size / 2;
  const cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, size * 0.4, cx, cy, size * 0.75);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
};
