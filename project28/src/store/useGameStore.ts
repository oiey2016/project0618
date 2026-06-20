import { create } from 'zustand';
import type { GameStore, Player, Ball, Team, GamePhase } from '../game/types';
import { COURT, PLAYER, BALL, RULES, COLORS } from '../game/constants';
import {
  clampToCourt,
  playerPlayerCollision,
  ballWallCollision,
  getControllablePlayer,
  findNearestBallToPickup,
  attemptCatch,
  attemptHit,
  throwBall,
  setupPlayerOnBench,
} from '../game/physics';
import {
  nextId,
  spawnParticles,
  spawnSparkBurst,
  spawnShockWave,
  spawnFloatingText,
  updateParticles,
  updateShockWaves,
  updateFloatingTexts,
  clamp,
  lerp,
  dist,
} from '../game/utils';
import { SFX } from '../game/audio';

function createInitialPlayers(): Player[] {
  const players: Player[] = [];
  const spawnY = COURT.HEIGHT / 2;
  const spacing = 90;

  for (let i = 0; i < PLAYER.PER_TEAM; i++) {
    const offset = (i - (PLAYER.PER_TEAM - 1) / 2) * spacing;
    players.push({
      id: `blue_${i}`,
      team: 'blue',
      x: COURT.WALL_LEFT + 80 + (i % 2) * 50,
      y: spawnY + offset,
      targetX: COURT.WALL_LEFT + 80 + (i % 2) * 50,
      targetY: spawnY + offset,
      vx: 0,
      vy: 0,
      radius: PLAYER.RADIUS,
      status: 'active',
      facingAngle: 0,
      hasBall: null,
      chargeTime: 0,
      isCharging: false,
      catchWindow: 0,
      flashTime: 0,
      rescued: false,
      benchOrder: 0,
      jumpAnim: 0,
      squash: 1,
      stretch: 1,
    });
  }
  for (let i = 0; i < PLAYER.PER_TEAM; i++) {
    const offset = (i - (PLAYER.PER_TEAM - 1) / 2) * spacing;
    players.push({
      id: `red_${i}`,
      team: 'red',
      x: COURT.WALL_RIGHT - 80 - (i % 2) * 50,
      y: spawnY + offset,
      targetX: COURT.WALL_RIGHT - 80 - (i % 2) * 50,
      targetY: spawnY + offset,
      vx: 0,
      vy: 0,
      radius: PLAYER.RADIUS,
      status: 'active',
      facingAngle: Math.PI,
      hasBall: null,
      chargeTime: 0,
      isCharging: false,
      catchWindow: 0,
      flashTime: 0,
      rescued: false,
      benchOrder: 0,
      jumpAnim: 0,
      squash: 1,
      stretch: 1,
    });
  }
  return players;
}

function createInitialBalls(): Ball[] {
  const balls: Ball[] = [];
  const positions = [
    { x: COURT.MIDLINE_X, y: COURT.HEIGHT * 0.2 },
    { x: COURT.MIDLINE_X, y: COURT.HEIGHT * 0.5 },
    { x: COURT.MIDLINE_X, y: COURT.HEIGHT * 0.8 },
  ];
  for (let i = 0; i < BALL.INITIAL_COUNT; i++) {
    const pos = positions[i % positions.length];
    balls.push({
      id: `ball_${i}`,
      x: pos.x + (i % 2 === 0 ? -30 : 30),
      y: pos.y,
      prevX: pos.x,
      prevY: pos.y,
      vx: 0,
      vy: 0,
      radius: BALL.RADIUS,
      ownerTeam: null,
      throwerId: null,
      isActive: true,
      spin: 0,
      heldBy: null,
      inAir: false,
      trail: [],
    });
  }
  return balls;
}

function createInitialState(): Omit<GameStore, 'actions'> {
  return {
    phase: 'menu',
    countdown: RULES.COUNTDOWN,
    countdownFloat: RULES.COUNTDOWN,
    timeLeft: RULES.MATCH_DURATION,
    players: createInitialPlayers(),
    balls: createInitialBalls(),
    particles: [],
    shockWaves: [],
    floatingTexts: [],
    screenShake: 0,
    flashOverlay: 0,
    winner: null,
    scores: { blue: 0, red: 0 },
    teamKills: { blue: 0, red: 0 },
    ballSpawnTimer: BALL.RESPAWN_INTERVAL,
    hintText: '',
    hintTimer: 0,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  actions: {
    startGame: () => {
      SFX.menuClick();
      const s = createInitialState();
      set({
        ...s,
        phase: 'countdown',
        countdown: RULES.COUNTDOWN,
        countdownFloat: RULES.COUNTDOWN,
        hintText: '准备好了吗？',
        hintTimer: RULES.HINT_DURATION,
      });
      SFX.countdown(RULES.COUNTDOWN);
    },

    resetGame: () => {
      SFX.menuClick();
      get().actions.startGame();
    },

    goToMenu: () => {
      SFX.menuClick();
      set({ ...createInitialState() });
    },

    playerMove: (team: Team, dir) => {
      const state = get();
      if (state.phase !== 'playing') return;
      const p = getControllablePlayer(state.players, team);
      if (!p) return;

      const mag = Math.hypot(dir.x, dir.y);
      if (mag > 0.001) {
        const nx = dir.x / mag;
        const ny = dir.y / mag;
        p.vx = nx * PLAYER.MOVE_SPEED;
        p.vy = ny * PLAYER.MOVE_SPEED;
        if (team === 'blue') {
          p.facingAngle = Math.atan2(ny, Math.max(nx, 0.1));
        } else {
          p.facingAngle = Math.atan2(ny, Math.min(nx, -0.1));
        }
      } else {
        p.vx *= 0.7;
        p.vy *= 0.7;
      }
    },

    playerStartCharge: (team: Team) => {
      const state = get();
      if (state.phase !== 'playing') return;
      const p = getControllablePlayer(state.players, team);
      if (!p) return;

      if (p.hasBall) {
        p.isCharging = true;
        p.chargeTime = 0;
        p.squash = PLAYER.SQUASH_ON_CHARGE;
        SFX.charge();
      } else {
        p.catchWindow = PLAYER.CATCH_WINDOW;
        const balls = get().balls;
        const caught = attemptCatch(
          p,
          balls,
          get().players,
          (x, y, color) => spawnParticles(get().particles, x, y, 20, color),
          (x, y, color) => spawnShockWave(get().shockWaves, x, y, 120, color, 500),
          (x, y, text, color) => spawnFloatingText(get().floatingTexts, x, y, text, color, 18, 800),
          (t, n) => {
            const sc = { ...get().scores };
            sc[t] += n;
            set({ scores: sc });
          },
        );
        if (!caught) {
          const nearest = findNearestBallToPickup(balls, p, 48);
          if (nearest) {
            nearest.heldBy = p.id;
            nearest.vx = 0;
            nearest.vy = 0;
            nearest.ownerTeam = p.team;
            nearest.inAir = false;
            p.hasBall = nearest.id;
          }
        }
      }
    },

    playerReleaseCharge: (team: Team) => {
      const state = get();
      if (state.phase !== 'playing') return;
      const p = getControllablePlayer(state.players, team);
      if (!p || !p.isCharging || !p.hasBall) {
        if (p) {
          p.isCharging = false;
          p.chargeTime = 0;
          p.squash = 1;
        }
        return;
      }
      const ball = state.balls.find((b) => b.id === p.hasBall);
      if (!ball) {
        p.isCharging = false;
        p.chargeTime = 0;
        p.squash = 1;
        return;
      }
      const ratio = clamp(p.chargeTime / PLAYER.MAX_CHARGE, 0.1, 1);
      throwBall(p, ball, ratio);
      p.isCharging = false;
      p.chargeTime = 0;
      p.stretch = PLAYER.STRETCH_ON_THROW;
      set({ hintText: p.team === 'blue' ? '蓝队发射!' : '红队发射!', hintTimer: 1200 });
    },

    tick: (dtRaw) => {
      const state = get();
      const dt = Math.min(dtRaw, 50);
      const dts = dt / 1000;

      if (state.phase === 'countdown') {
        const newFloat = state.countdownFloat - dts;
        const newInt = Math.ceil(newFloat);
        if (newInt !== state.countdown && newInt >= 0) {
          SFX.countdown(newInt);
          if (newInt === 0) {
            set({ hintText: '游戏开始!', hintTimer: 2000 });
            SFX.victory();
          }
        }
        if (newFloat <= 0) {
          set({ phase: 'playing', countdownFloat: 0, countdown: 0 });
        } else {
          set({ countdownFloat: newFloat, countdown: newInt });
        }
      }

      if (state.phase === 'paused' || state.phase === 'result' || state.phase === 'menu') {
        set({
          particles: updateParticles(state.particles, dts),
          shockWaves: updateShockWaves(state.shockWaves, dts),
          floatingTexts: updateFloatingTexts(state.floatingTexts, dts),
          screenShake: Math.max(0, state.screenShake - dt * 0.06),
          flashOverlay: Math.max(0, state.flashOverlay - dt * 0.004),
        });
        return;
      }

      if (state.phase === 'playing') {
        const newTime = state.timeLeft - dt;
        if (newTime <= 0) {
          endMatch();
          return;
        }

        const players = state.players.map((p) => ({ ...p }));
        const balls = state.balls.map((b) => ({ ...b, trail: [...b.trail] }));
        let particles = [...state.particles];
        let shockWaves = [...state.shockWaves];
        let floatingTexts = [...state.floatingTexts];
        let screenShake = state.screenShake;
        let flashOverlay = state.flashOverlay;
        let teamKills = { ...state.teamKills };
        let ballSpawnTimer = state.ballSpawnTimer - dt;

        for (const p of players) {
          if (p.status === 'active') {
            p.targetX = p.x + p.vx * dts;
            p.targetY = p.y + p.vy * dts;
            p.x = lerp(p.x, p.targetX, 0.5);
            p.y = lerp(p.y, p.targetY, 0.5);
            p.vx *= 0.85;
            p.vy *= 0.85;
            clampToCourt(p);

            if (p.isCharging) {
              p.chargeTime = Math.min(p.chargeTime + dt, PLAYER.MAX_CHARGE);
              p.squash = lerp(p.squash, PLAYER.SQUASH_ON_CHARGE, 0.2);
            } else {
              p.squash = lerp(p.squash, 1, 0.15);
            }
            p.stretch = lerp(p.stretch, 1, 0.12);

            if (p.catchWindow > 0) p.catchWindow -= dt;
            if (p.flashTime > 0) p.flashTime -= dt;
            if (p.jumpAnim > 0) p.jumpAnim -= dt;
            p.rescued = false;

            if (p.hasBall) {
              const b = balls.find((bb) => bb.id === p.hasBall);
              if (b) {
                b.x = p.x;
                b.y = p.y - 8;
                b.prevX = b.x;
                b.prevY = b.y;
                b.vx = 0;
                b.vy = 0;
                b.trail = [];
              }
            }
          } else if (p.status === 'bench') {
            p.flashTime = 0;
          }
        }

        playerPlayerCollision(players);

        for (const b of balls) {
          if (!b.isActive || b.heldBy) continue;
          b.prevX = b.x;
          b.prevY = b.y;
          b.x += b.vx * dts;
          b.y += b.vy * dts;
          b.spin += (Math.hypot(b.vx, b.vy) / 100) * dts * 3;

          if (ballWallCollision(b)) {
            spawnParticles(particles, b.x, b.y, 4, COLORS.NEUTRAL);
            if (Math.hypot(b.vx, b.vy) > 250) SFX.bounce();
          }
          b.vx *= BALL.FRICTION;
          b.vy *= BALL.FRICTION;
          if (Math.hypot(b.vx, b.vy) < 30) {
            b.vx = 0;
            b.vy = 0;
            b.inAir = false;
          } else {
            b.inAir = true;
          }

          b.trail.unshift({ x: b.x, y: b.y, alpha: 1 });
          if (b.trail.length > BALL.TRAIL_LENGTH) b.trail.pop();
          for (let i = 0; i < b.trail.length; i++) {
            b.trail[i].alpha = 1 - i / BALL.TRAIL_LENGTH;
          }

          const hit = attemptHit(
            b,
            players,
            (x, y, color) => spawnParticles(particles, x, y, 24, color),
            (x, y, color) => spawnSparkBurst(particles, x, y, 18, color),
            (x, y, text, color) => spawnFloatingText(floatingTexts, x, y, text, color, 22, 1000),
            (amt) => {
              screenShake = Math.max(screenShake, amt);
            },
            (amt) => {
              flashOverlay = Math.max(flashOverlay, amt);
            },
            (t) => {
              teamKills[t] += 1;
            },
            (pp) => {
              setupPlayerOnBench(pp, players);
            },
          );
          if (hit) {
            const winTeam = b.ownerTeam!;
            const activeEnemies = players.filter(
              (pp) => pp.team !== winTeam && pp.status === 'active',
            );
            if (activeEnemies.length === 0) {
              set({
                phase: 'result',
                winner: winTeam,
                particles,
                shockWaves,
                floatingTexts,
                screenShake,
                flashOverlay,
                teamKills,
                players,
                balls,
              });
              SFX.victory();
              return;
            }
          }
        }

        let spawnedCount = balls.filter((b) => b.isActive || b.heldBy).length;
        while (ballSpawnTimer <= 0 && spawnedCount < BALL.MAX_ACTIVE) {
          const side = Math.random() > 0.5 ? 'blue' : 'red';
          const bx = side === 'blue'
            ? COURT.MIDLINE_X - 150 - Math.random() * 100
            : COURT.MIDLINE_X + 150 + Math.random() * 100;
          const by = COURT.WALL_TOP + 60 + Math.random() * (COURT.WALL_BOTTOM - COURT.WALL_TOP - 120);
          balls.push({
            id: nextId(),
            x: bx,
            y: by,
            prevX: bx,
            prevY: by,
            vx: 0,
            vy: 0,
            radius: BALL.RADIUS,
            ownerTeam: null,
            throwerId: null,
            isActive: true,
            spin: 0,
            heldBy: null,
            inAir: false,
            trail: [],
          });
          spawnShockWave(shockWaves, bx, by, 50, COLORS.BALL, 400);
          spawnFloatingText(floatingTexts, bx, by - 20, '+球', COLORS.BALL, 14, 700);
          spawnedCount++;
          ballSpawnTimer = BALL.RESPAWN_INTERVAL;
        }

        particles = updateParticles(particles, dts);
        shockWaves = updateShockWaves(shockWaves, dts);
        floatingTexts = updateFloatingTexts(floatingTexts, dts);
        screenShake = Math.max(0, screenShake - dt * 0.05);
        flashOverlay = Math.max(0, flashOverlay - dt * 0.0035);

        const hintTimer = Math.max(0, state.hintTimer - dt);

        set({
          timeLeft: newTime,
          players,
          balls,
          particles,
          shockWaves,
          floatingTexts,
          screenShake,
          flashOverlay,
          teamKills,
          ballSpawnTimer,
          hintTimer,
        });
      }
    },
  },
}));

function endMatch() {
  const state = useGameStore.getState();
  const blueAlive = state.players.filter((p) => p.team === 'blue' && p.status === 'active').length;
  const redAlive = state.players.filter((p) => p.team === 'red' && p.status === 'active').length;
  let winner: Team | null = null;
  if (blueAlive > redAlive) winner = 'blue';
  else if (redAlive > blueAlive) winner = 'red';
  else {
    if (state.teamKills.blue > state.teamKills.red) winner = 'blue';
    else if (state.teamKills.red > state.teamKills.blue) winner = 'red';
    else winner = Math.random() > 0.5 ? 'blue' : 'red';
  }
  setFinalPhase(winner);
  SFX.victory();
}

function setFinalPhase(winner: Team) {
  const s = useGameStore.getState();
  const particles = [...s.particles];
  for (let i = 0; i < 120; i++) {
    spawnParticles(particles, COURT.MIDLINE_X, COURT.HEIGHT, 0, [
      COLORS.BLUE_TEAM,
      COLORS.RED_TEAM,
      COLORS.CATCH_GOLD,
      COLORS.BALL,
      '#A855F7',
      '#22C55E',
    ], { type: 'confetti', maxLife: 4000 });
  }
  const players = s.players.map((p) => ({ ...p }));
  for (const p of players) {
    if (p.team === winner && p.status === 'active') {
      p.jumpAnim = 2000;
    }
  }
  useGameStore.setState({
    phase: 'result',
    winner,
    particles,
    players,
  });
}
