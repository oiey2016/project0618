import type { Player, Ball, Team } from './types';
import { COURT, PLAYER, BALL, COLORS } from './constants';
import { clamp, dist2, dist, normalize } from './utils';
import { SFX } from './audio';

export function isInOwnHalf(p: Player): boolean {
  return p.team === 'blue'
    ? p.x <= COURT.MIDLINE_X
    : p.x >= COURT.MIDLINE_X;
}

export function clampToCourt(p: Player) {
  const r = p.radius;
  if (p.team === 'blue') {
    p.x = clamp(p.x, COURT.WALL_LEFT + r, COURT.MIDLINE_X - r);
  } else {
    p.x = clamp(p.x, COURT.MIDLINE_X + r, COURT.WALL_RIGHT - r);
  }
  p.y = clamp(p.y, COURT.WALL_TOP + r, COURT.WALL_BOTTOM - r);
}

export function playerPlayerCollision(players: Player[]) {
  for (let i = 0; i < players.length; i++) {
    const a = players[i];
    if (a.status !== 'active') continue;
    for (let j = i + 1; j < players.length; j++) {
      const b = players[j];
      if (b.status !== 'active') continue;
      if (a.team !== b.team) continue;

      const minDist = a.radius + b.radius;
      const d2 = dist2(a.x, a.y, b.x, b.y);
      if (d2 < minDist * minDist && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const overlap = minDist - d;
        const nx = (b.x - a.x) / d;
        const ny = (b.y - a.y) / d;
        a.x -= nx * overlap * 0.5;
        a.y -= ny * overlap * 0.5;
        b.x += nx * overlap * 0.5;
        b.y += ny * overlap * 0.5;
      }
    }
  }
}

export function ballWallCollision(b: Ball): boolean {
  let bounced = false;
  const r = b.radius;

  if (b.x - r < COURT.WALL_LEFT) {
    b.x = COURT.WALL_LEFT + r;
    b.vx = -b.vx * BALL.WALL_BOUNCE;
    bounced = true;
  } else if (b.x + r > COURT.WALL_RIGHT) {
    b.x = COURT.WALL_RIGHT - r;
    b.vx = -b.vx * BALL.WALL_BOUNCE;
    bounced = true;
  }
  if (b.y - r < COURT.WALL_TOP) {
    b.y = COURT.WALL_TOP + r;
    b.vy = -b.vy * BALL.WALL_BOUNCE;
    bounced = true;
  } else if (b.y + r > COURT.WALL_BOTTOM) {
    b.y = COURT.WALL_BOTTOM - r;
    b.vy = -b.vy * BALL.WALL_BOUNCE;
    bounced = true;
  }

  if (bounced) {
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < BALL.MIN_BOUNCE_SPEED) {
      b.vx = 0;
      b.vy = 0;
    }
  }
  return bounced;
}

export function getControllablePlayer(players: Player[], team: Team): Player | null {
  const active = players.filter((p) => p.team === team && p.status === 'active');
  if (active.length === 0) return null;
  active.sort((a, b) => {
    if (a.hasBall && !b.hasBall) return -1;
    if (!a.hasBall && b.hasBall) return 1;
    return 0;
  });
  return active[0];
}

export function findNearestBallToPickup(
  balls: Ball[],
  p: Player,
  threshold = 50,
): Ball | null {
  let best: Ball | null = null;
  let bestD = threshold * threshold;
  for (const b of balls) {
    if (!b.isActive || b.heldBy || b.inAir) continue;
    if (b.ownerTeam && b.ownerTeam !== p.team) {
      const speed = Math.hypot(b.vx, b.vy);
      if (speed > 150) continue;
    }
    const d2 = dist2(b.x, b.y, p.x, p.y);
    if (d2 < bestD) {
      bestD = d2;
      best = b;
    }
  }
  return best;
}

export function attemptCatch(
  catcher: Player,
  balls: Ball[],
  players: Player[],
  spawnParticleFn: (x: number, y: number, color: string) => void,
  spawnShockFn: (x: number, y: number, color: string) => void,
  spawnTextFn: (x: number, y: number, text: string, color: string) => void,
  scoreFn: (team: Team, amount: number) => void,
): Ball | null {
  for (const b of balls) {
    if (!b.isActive || b.heldBy || !b.ownerTeam || b.ownerTeam === catcher.team) continue;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < 120) continue;

    const d = dist(b.x, b.y, catcher.x, catcher.y);
    if (d < PLAYER.CATCH_RADIUS) {
      const { x: dx, y: dy } = normalize(b.vx, b.vy);
      const toCatcherX = catcher.x - b.x;
      const toCatcherY = catcher.y - b.y;
      const dot = dx * toCatcherX + dy * toCatcherY;
      if (dot < -10) continue;

      b.isActive = false;
      b.heldBy = catcher.id;
      b.inAir = false;
      b.vx = 0;
      b.vy = 0;
      b.ownerTeam = catcher.team;
      catcher.hasBall = b.id;
      catcher.catchWindow = 0;

      const team = catcher.team;
      const bench = players
        .filter((p) => p.team === team && p.status === 'bench')
        .sort((a, b) => a.benchOrder - b.benchOrder);
      if (bench.length > 0) {
        const rescued = bench[0];
        rescued.status = 'active';
        rescued.benchOrder = 0;
        rescued.rescued = true;
        rescued.flashTime = 600;
        rescued.jumpAnim = 500;
        const spawnX =
          team === 'blue'
            ? COURT.WALL_LEFT + 60 + Math.random() * (COURT.MIDLINE_X - COURT.WALL_LEFT - 120)
            : COURT.MIDLINE_X + 60 + Math.random() * (COURT.WALL_RIGHT - COURT.MIDLINE_X - 120);
        rescued.x = spawnX;
        rescued.y = COURT.HEIGHT / 2 + (Math.random() - 0.5) * 200;
        spawnParticleFn(rescued.x, rescued.y, COLORS.CATCH_GOLD);
        spawnTextFn(rescued.x, rescued.y - 50, '救回!', COLORS.CATCH_GOLD);
        scoreFn(team, 1);
        SFX.rescue();
      }

      spawnParticleFn(catcher.x, catcher.y, COLORS.CATCH_GOLD);
      spawnShockFn(catcher.x, catcher.y, COLORS.CATCH_GOLD);
      spawnTextFn(catcher.x, catcher.y - 40, '接球!', COLORS.CATCH_GOLD);
      catcher.flashTime = 400;
      SFX.catch();
      return b;
    }
  }
  return null;
}

export function attemptHit(
  ball: Ball,
  players: Player[],
  spawnParticleFn: (x: number, y: number, color: string) => void,
  spawnSparkFn: (x: number, y: number, color: string) => void,
  spawnTextFn: (x: number, y: number, text: string, color: string) => void,
  setShakeFn: (amt: number) => void,
  setFlashFn: (amt: number) => void,
  killCountFn: (team: Team) => void,
  benchPlayer: (p: Player) => void,
): Player | null {
  if (!ball.isActive || ball.heldBy) return null;
  if (!ball.ownerTeam) return null;
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed < 180) return null;

  for (const p of players) {
    if (p.status !== 'active') continue;
    if (p.team === ball.ownerTeam) continue;
    if (p.catchWindow > 0) continue;

    const r = p.radius + ball.radius;
    if (dist2(p.x, p.y, ball.x, ball.y) < r * r * 0.85) {
      ball.isActive = false;
      ball.inAir = false;
      ball.vx *= 0.2;
      ball.vy *= 0.2;
      p.flashTime = PLAYER.FLASH_DURATION;
      benchPlayer(p);
      killCountFn(ball.ownerTeam);

      spawnParticleFn(p.x, p.y, p.team === 'blue' ? COLORS.BLUE_TEAM : COLORS.RED_TEAM);
      spawnSparkFn(p.x, p.y, COLORS.HIT_SPARK);
      spawnTextFn(
        p.x,
        p.y - 40,
        '击中!',
        ball.ownerTeam === 'blue' ? COLORS.BLUE_TEAM : COLORS.RED_TEAM,
      );
      setShakeFn(speed > 500 ? 18 : 10);
      setFlashFn(0.3);
      SFX.hit();
      SFX.playerOut();
      return p;
    }
  }
  return null;
}

export function throwBall(
  thrower: Player,
  ball: Ball,
  chargeRatio: number,
) {
  const speed = clamp(
    BALL.MIN_SPEED + (BALL.MAX_SPEED - BALL.MIN_SPEED) * chargeRatio,
    BALL.MIN_SPEED,
    BALL.MAX_SPEED,
  );

  let dx: number;
  let dy: number;
  if (thrower.team === 'blue') {
    dx = 1;
  } else {
    dx = -1;
  }
  const absFacing = Math.abs(thrower.facingAngle);
  if (absFacing < Math.PI * 0.4) {
    dy = Math.sin(thrower.facingAngle);
  } else {
    dy = thrower.vy !== 0 ? clamp(thrower.vy / PLAYER.MOVE_SPEED, -0.5, 0.5) : (Math.random() - 0.5) * 0.4;
  }
  const n = normalize(dx, dy);

  ball.heldBy = null;
  ball.inAir = true;
  ball.ownerTeam = thrower.team;
  ball.throwerId = thrower.id;
  ball.isActive = true;
  ball.x = thrower.x + n.x * (thrower.radius + ball.radius + 2);
  ball.y = thrower.y + n.y * (thrower.radius + ball.radius + 2);
  ball.prevX = ball.x;
  ball.prevY = ball.y;
  ball.vx = n.x * speed;
  ball.vy = n.y * speed;
  thrower.hasBall = null;
  thrower.stretch = 1;
  thrower.squash = 1;

  SFX.throw();
}

export function setupPlayerOnBench(p: Player, allPlayers: Player[]) {
  p.status = 'bench';
  const teammates = allPlayers.filter(
    (q) => q.team === p.team && q.status === 'bench' && q.id !== p.id,
  );
  p.benchOrder = teammates.reduce((m, q) => Math.max(m, q.benchOrder), 0) + 1;
  const isLeft = p.team === 'blue';
  const benchY = 80 + p.benchOrder * 40;
  p.targetX = isLeft ? COURT.WALL_LEFT - 30 : COURT.WALL_RIGHT + 30;
  p.targetY = clamp(benchY, COURT.WALL_TOP + 30, COURT.WALL_BOTTOM - 30);
  p.x = p.targetX;
  p.y = p.targetY;
  p.vx = 0;
  p.vy = 0;
  p.hasBall = null;
  p.isCharging = false;
  p.chargeTime = 0;
}
