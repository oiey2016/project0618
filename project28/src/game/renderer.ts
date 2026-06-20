import type { Player, Ball, Particle, ShockWave, FloatingText, Team } from './types';
import { COURT, COLORS, TEAM_COLORS, PLAYER, BALL } from './constants';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  state: {
    players: Player[];
    balls: Ball[];
    particles: Particle[];
    shockWaves: ShockWave[];
    floatingTexts: FloatingText[];
    screenShake: number;
    flashOverlay: number;
    phase: string;
    countdown: number;
    countdownFloat: number;
  },
) {
  const scaleX = canvasWidth / COURT.WIDTH;
  const scaleY = canvasHeight / COURT.HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (canvasWidth - COURT.WIDTH * scale) / 2;
  const offsetY = (canvasHeight - COURT.HEIGHT * scale) / 2;

  ctx.save();
  ctx.fillStyle = 'transparent';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const shakeX = (Math.random() - 0.5) * state.screenShake;
  const shakeY = (Math.random() - 0.5) * state.screenShake;
  ctx.translate(offsetX + shakeX, offsetY + shakeY);
  ctx.scale(scale, scale);

  drawCourt(ctx);
  drawBenches(ctx);

  for (const sw of state.shockWaves) {
    drawShockWave(ctx, sw);
  }

  for (const b of state.balls) {
    if (b.heldBy) continue;
    drawBallTrail(ctx, b);
  }

  const sortedPlayers = [...state.players].sort((a, b) => {
    const aZ = a.status === 'active' ? 1 : 0;
    const bZ = b.status === 'active' ? 1 : 0;
    return aZ - bZ || a.y - b.y;
  });

  for (const p of sortedPlayers) {
    if (p.status === 'bench') drawPlayer(ctx, p);
  }

  for (const p of sortedPlayers) {
    if (p.status === 'active') drawPlayer(ctx, p);
  }

  for (const b of state.balls) {
    if (b.heldBy) continue;
    drawBall(ctx, b);
  }

  for (const b of state.balls) {
    if (b.heldBy) {
      const holder = state.players.find((p) => p.id === b.heldBy);
      if (holder) drawHeldBall(ctx, b, holder);
    }
  }

  for (const particle of state.particles) {
    drawParticle(ctx, particle);
  }

  for (const ft of state.floatingTexts) {
    drawFloatingText(ctx, ft);
  }

  drawCourtVignette(ctx);

  if (state.phase === 'countdown') {
    drawCountdown(ctx, state.countdownFloat);
  }

  ctx.restore();

  if (state.flashOverlay > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(255,255,255,${Math.min(state.flashOverlay, 0.8)})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }
}

function drawCourt(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, COURT.HEIGHT);
  grad.addColorStop(0, '#C68E5C');
  grad.addColorStop(0.5, '#A0522D');
  grad.addColorStop(1, '#7B3F1A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, COURT.WIDTH, COURT.HEIGHT);

  const plankH = 35;
  for (let y = 0; y < COURT.HEIGHT; y += plankH) {
    const t = y / COURT.HEIGHT;
    ctx.fillStyle = `rgba(60, 25, 0, ${0.12 + Math.sin(y * 0.3) * 0.04})`;
    ctx.fillRect(0, y, COURT.WIDTH, 2);
    ctx.fillStyle = `rgba(255, 220, 180, ${0.03 + (t > 0.5 ? (1 - t) * 0.03 : t * 0.03)})`;
    ctx.fillRect(0, y + plankH - 2, COURT.WIDTH, 2);
  }

  for (let x = 0; x < COURT.WIDTH; x += 120) {
    ctx.fillStyle = `rgba(60, 25, 0, ${0.06 + Math.sin(x * 0.15) * 0.03})`;
    ctx.fillRect(x, 0, 1.5, COURT.HEIGHT);
  }

  ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
  ctx.lineWidth = 80;
  ctx.fillRect(COURT.WALL_LEFT, 0, COURT.MIDLINE_X - COURT.WALL_LEFT, COURT.HEIGHT);
  ctx.strokeStyle = 'rgba(255, 61, 104, 0.12)';
  ctx.fillRect(COURT.MIDLINE_X, 0, COURT.WALL_RIGHT - COURT.MIDLINE_X, COURT.HEIGHT);

  ctx.save();
  ctx.strokeStyle = COLORS.MIDLINE;
  ctx.lineWidth = 4;
  ctx.setLineDash([16, 14]);
  ctx.shadowColor = COLORS.MIDLINE;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(COURT.MIDLINE_X, COURT.WALL_TOP);
  ctx.lineTo(COURT.MIDLINE_X, COURT.WALL_BOTTOM);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = COLORS.COURT_LINE;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255,255,255,0.5)';
  ctx.shadowBlur = 8;
  roundRect(
    ctx,
    COURT.WALL_LEFT,
    COURT.WALL_TOP,
    COURT.WALL_RIGHT - COURT.WALL_LEFT,
    COURT.WALL_BOTTOM - COURT.WALL_TOP,
    COURT.CORNER_RADIUS,
  );
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.arc(COURT.MIDLINE_X, COURT.HEIGHT / 2, 70, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  roundRect(ctx, 0, 0, COURT.WIDTH, COURT.WALL_TOP, 0);
  ctx.fill();
  roundRect(ctx, 0, COURT.WALL_BOTTOM, COURT.WIDTH, COURT.HEIGHT - COURT.WALL_BOTTOM, 0);
  ctx.fill();
}

function drawBenches(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = COLORS.BENCH_BLUE;
  roundRect(ctx, 2, COURT.WALL_TOP - 4, 14, COURT.WALL_BOTTOM - COURT.WALL_TOP + 8, 6);
  ctx.fill();

  ctx.fillStyle = COLORS.BENCH_RED;
  roundRect(ctx, COURT.WIDTH - 16, COURT.WALL_TOP - 4, 14, COURT.WALL_BOTTOM - COURT.WALL_TOP + 8, 6);
  ctx.fill();

  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.BLUE_TEAM;
  ctx.save();
  ctx.translate(8, COURT.HEIGHT / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('替补席', 0, 3);
  ctx.restore();

  ctx.fillStyle = COLORS.RED_TEAM;
  ctx.save();
  ctx.translate(COURT.WIDTH - 8, COURT.HEIGHT / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText('替补席', 0, 3);
  ctx.restore();
  ctx.restore();
}

function drawCourtVignette(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createRadialGradient(
    COURT.WIDTH / 2,
    COURT.HEIGHT / 2,
    Math.min(COURT.WIDTH, COURT.HEIGHT) * 0.3,
    COURT.WIDTH / 2,
    COURT.HEIGHT / 2,
    Math.max(COURT.WIDTH, COURT.HEIGHT) * 0.75,
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, COURT.WIDTH, COURT.HEIGHT);
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player) {
  const tc = TEAM_COLORS[p.team];
  const benchMod = p.status === 'bench' ? 0.5 : 1;
  const jumpOffset =
    p.jumpAnim > 0 ? -Math.abs(Math.sin((2000 - p.jumpAnim) / 2000 * Math.PI * 3)) * 18 : 0;

  ctx.save();
  ctx.translate(p.x, p.y + jumpOffset);

  ctx.save();
  ctx.translate(-p.x, -jumpOffset);
  ctx.fillStyle = `rgba(0,0,0,${0.25 * benchMod})`;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + p.radius * 0.9, p.radius * 0.9, p.radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.scale(p.stretch, p.squash);

  if (p.catchWindow > 0) {
    const t = p.catchWindow / PLAYER.CATCH_WINDOW;
    ctx.save();
    ctx.strokeStyle = COLORS.CATCH_GOLD;
    ctx.globalAlpha = t;
    ctx.lineWidth = 4;
    ctx.shadowColor = COLORS.CATCH_GOLD;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, PLAYER.CATCH_RADIUS * (1 - t * 0.2), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.shadowColor = tc.shadow;
  ctx.shadowBlur = 15 * benchMod;
  const bodyGrad = ctx.createRadialGradient(-6, -6, 4, 0, 0, p.radius);
  bodyGrad.addColorStop(0, lighten(tc.main, 0.25));
  bodyGrad.addColorStop(0.7, tc.main);
  bodyGrad.addColorStop(1, tc.dark);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = p.status === 'bench' ? 'rgba(0,0,0,0.4)' : tc.dark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, p.radius - 0.5, 0, Math.PI * 2);
  ctx.stroke();

  const eyeX = Math.cos(p.facingAngle) * 6;
  const eyeY = Math.sin(p.facingAngle) * 3;
  ctx.fillStyle = `rgba(255,255,255,${benchMod})`;
  ctx.beginPath();
  ctx.arc(-6 + eyeX * 0.3, -4 + eyeY, 5.5, 0, Math.PI * 2);
  ctx.arc(6 + eyeX * 0.3, -4 + eyeY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(15, 23, 42, ${benchMod})`;
  ctx.beginPath();
  ctx.arc(-6 + eyeX, -4 + eyeY, 2.8, 0, Math.PI * 2);
  ctx.arc(6 + eyeX, -4 + eyeY, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(255,255,255,${0.8 * benchMod})`;
  ctx.beginPath();
  ctx.arc(-5 + eyeX * 0.6, -5.5 + eyeY, 1.2, 0, Math.PI * 2);
  ctx.arc(7 + eyeX * 0.6, -5.5 + eyeY, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(15, 23, 42, ${benchMod})`;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 4, 7, 0.25, Math.PI - 0.25);
  if (p.jumpAnim > 0 && p.status === 'active') {
    ctx.stroke();
    ctx.fillStyle = `rgba(255,100,120,${benchMod})`;
    ctx.beginPath();
    ctx.arc(0, 6, 6, 0.15, Math.PI - 0.15);
    ctx.fill();
  } else {
    ctx.stroke();
  }

  if (p.isCharging && p.hasBall) {
    const ratio = p.chargeTime / PLAYER.MAX_CHARGE;
    const chargeR = p.radius + 6 + ratio * 10;
    ctx.save();
    ctx.strokeStyle = COLORS.CATCH_GOLD;
    ctx.lineWidth = 3 + ratio * 2;
    ctx.shadowColor = COLORS.CATCH_GOLD;
    ctx.shadowBlur = 10 + ratio * 18;
    ctx.globalAlpha = 0.6 + ratio * 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, chargeR, -Math.PI / 2, -Math.PI / 2 + ratio * Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (p.flashTime > 0) {
    const a = Math.min(1, p.flashTime / 100);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (p.rescued) {
    ctx.save();
    ctx.strokeStyle = COLORS.CATCH_GOLD;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.9;
    ctx.shadowColor = COLORS.CATCH_GOLD;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius + 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (p.status === 'bench') {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✖', 0, 1);
    ctx.restore();
  }

  ctx.restore();
}

function drawBall(ctx: CanvasRenderingContext2D, b: Ball) {
  const speed = Math.hypot(b.vx, b.vy);
  const scaleMod = b.inAir && speed > 500 ? 1.08 : 1;

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.spin);
  ctx.scale(scaleMod, 1 / scaleMod);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;
  const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, b.radius);
  grad.addColorStop(0, '#FFD89B');
  grad.addColorStop(0.4, COLORS.BALL);
  grad.addColorStop(1, COLORS.BALL_DARK);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(100, 40, 0, 0.8)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    const startA = i * Math.PI;
    ctx.ellipse(0, 0, b.radius * 0.92, b.radius * 0.35, startA, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, b.radius - 1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.ellipse(-4, -5, 3, 1.8, -0.5, 0, Math.PI * 2);
  ctx.fill();

  if (b.ownerTeam && speed > 400) {
    const col = b.ownerTeam === 'blue' ? COLORS.BLUE_TEAM : COLORS.RED_TEAM;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, b.radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawHeldBall(ctx: CanvasRenderingContext2D, b: Ball, holder: Player) {
  const tx = Math.cos(holder.facingAngle) * (holder.radius - 2);
  const ty = Math.sin(holder.facingAngle) * (holder.radius - 2) - 6;
  const bob = holder.isCharging ? Math.sin(holder.chargeTime * 0.02) * 2 : 0;

  ctx.save();
  ctx.translate(holder.x + tx, holder.y + ty + bob);
  ctx.rotate(b.spin);

  const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, b.radius * 0.9);
  grad.addColorStop(0, '#FFD89B');
  grad.addColorStop(0.4, COLORS.BALL);
  grad.addColorStop(1, COLORS.BALL_DARK);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, b.radius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(100, 40, 0, 0.7)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, b.radius * 0.85, b.radius * 0.3, i * Math.PI, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBallTrail(ctx: CanvasRenderingContext2D, b: Ball) {
  if (b.trail.length < 2) return;
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 1; i < b.trail.length; i++) {
    const t = b.trail[i];
    const prev = b.trail[i - 1];
    const alpha = t.alpha * 0.35;
    const r = b.radius * (1 - i / b.trail.length) * 0.9;
    ctx.strokeStyle = `rgba(255, 140, 0, ${alpha})`;
    ctx.lineWidth = r;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(t.x, t.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const lifeT = Math.max(0, p.life / p.maxLife);
  ctx.save();
  ctx.globalAlpha = lifeT;
  ctx.translate(p.x, p.y);
  if (p.rotation !== undefined) ctx.rotate(p.rotation);

  if (p.type === 'spark') {
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size * lifeT;
    ctx.lineCap = 'round';
    const len = 8 * lifeT + p.size;
    const ang = Math.atan2(p.vy, p.vx);
    ctx.beginPath();
    ctx.moveTo(-Math.cos(ang) * len, -Math.sin(ang) * len);
    ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
    ctx.stroke();
  } else if (p.type === 'confetti') {
    ctx.fillStyle = p.color;
    const s = p.size * 1.4;
    ctx.fillRect(-s / 2, -s / 2, s, s * 0.5);
  } else {
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.size * lifeT, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawShockWave(ctx: CanvasRenderingContext2D, s: ShockWave) {
  const t = s.life / s.maxLife;
  ctx.save();
  ctx.strokeStyle = s.color;
  ctx.lineWidth = 4 * t + 1;
  ctx.globalAlpha = t;
  ctx.shadowColor = s.color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawFloatingText(ctx: CanvasRenderingContext2D, ft: FloatingText) {
  const t = ft.life / ft.maxLife;
  ctx.save();
  ctx.globalAlpha = t;
  ctx.font = `bold ${ft.size}px JetBrains Mono, monospace`;
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0,0,0,0.7)';
  ctx.strokeText(ft.text, ft.x, ft.y);
  ctx.shadowColor = ft.color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = ft.color;
  ctx.fillText(ft.text, ft.x, ft.y);
  ctx.restore();
}

function drawCountdown(ctx: CanvasRenderingContext2D, floatVal: number) {
  const display = floatVal > 0 ? Math.ceil(floatVal) : 0;
  const t = 1 - (floatVal - Math.floor(floatVal));
  const text = floatVal <= 0.3 ? 'GO!' : display.toString();

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, COURT.WIDTH, COURT.HEIGHT);

  const scale = 1 + (1 - t) * 0.4;
  const alpha = Math.min(1, t * 1.5);

  ctx.translate(COURT.WIDTH / 2, COURT.HEIGHT / 2);
  ctx.scale(scale, scale);
  ctx.globalAlpha = alpha;

  ctx.font = 'bold 160px "Press Start 2P", JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#000';
  ctx.shadowColor = text === 'GO!' ? COLORS.CATCH_GOLD : COLORS.MIDLINE;
  ctx.shadowBlur = 50;
  ctx.strokeText(text, 0, 0);
  ctx.shadowBlur = 30;
  ctx.fillStyle = text === 'GO!' ? COLORS.CATCH_GOLD : '#FFFFFF';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function lighten(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr},${lg},${lb})`;
}

export function formatTime(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function teamActiveCount(players: Player[], team: Team): number {
  return players.filter((p) => p.team === team && p.status === 'active').length;
}

export function teamBenchCount(players: Player[], team: Team): number {
  return players.filter((p) => p.team === team && p.status === 'bench').length;
}
