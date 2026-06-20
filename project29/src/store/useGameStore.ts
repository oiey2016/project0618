import { create } from 'zustand';
import type {
  GamePhase,
  Player,
  PlayerId,
  Vector2,
  Particle,
  Shockwave,
  GameConfig,
} from '../types/game';
import {
  DEFAULT_CONFIG,
  P1_COLORS,
  P2_COLORS,
} from '../types/game';
import {
  updatePlayerMovement,
  resolvePlayerCollision,
  isPlayerOutOfBounds,
} from '../utils/physics';
import {
  createBurst,
  createShockwave,
  createTrailParticle,
  updateParticles,
  updateShockwaves,
} from '../utils/particles';
import { length as vecLength } from '../utils/vector2';

const CANVAS_SIZE = 700;
const ARENA_CENTER: Vector2 = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };

const createInitialPlayer = (
  id: PlayerId,
  config: GameConfig,
): Player => {
  const colors = id === 'P1' ? P1_COLORS : P2_COLORS;
  const offsetX = id === 'P1' ? -config.arenaRadius * 0.4 : config.arenaRadius * 0.4;
  return {
    id,
    position: {
      x: ARENA_CENTER.x + offsetX,
      y: ARENA_CENTER.y,
    },
    velocity: { x: 0, y: 0 },
    inputDirection: { x: 0, y: 0 },
    radius: config.playerRadius,
    color: colors.main,
    glowColor: colors.glow,
    darkColor: colors.dark,
    score: 0,
    isAlive: true,
    trail: [],
  };
};

interface GameState {
  phase: GamePhase;
  currentRound: number;
  countdown: number;
  roundWinner: PlayerId | null;
  gameWinner: PlayerId | null;

  players: Record<PlayerId, Player>;
  particles: Particle[];
  shockwaves: Shockwave[];

  config: GameConfig;
  arenaCenter: Vector2;
  canvasSize: number;

  roundEndTimer: number;

  actions: {
    startGame: () => void;
    resetRound: () => void;
    backToMenu: () => void;
    setPlayerInput: (player: PlayerId, direction: Vector2) => void;
    update: (deltaTime: number) => void;
  };
}

export const useGameStore = create<GameState>((set, get) => {
  const initialConfig = DEFAULT_CONFIG;

  return {
    phase: 'menu',
    currentRound: 1,
    countdown: 0,
    roundWinner: null,
    gameWinner: null,

    players: {
      P1: createInitialPlayer('P1', initialConfig),
      P2: createInitialPlayer('P2', initialConfig),
    },
    particles: [],
    shockwaves: [],

    config: initialConfig,
    arenaCenter: ARENA_CENTER,
    canvasSize: CANVAS_SIZE,

    roundEndTimer: 0,

    actions: {
      startGame: () => {
        const config = get().config;
        const p1 = createInitialPlayer('P1', config);
        const p2 = createInitialPlayer('P2', config);
        set({
          phase: 'countdown',
          currentRound: 1,
          countdown: 3,
          roundWinner: null,
          gameWinner: null,
          players: { P1: p1, P2: p2 },
          particles: [],
          shockwaves: [],
          roundEndTimer: 0,
        });
      },

      resetRound: () => {
        const config = get().config;
        const { players } = get();
        const p1 = createInitialPlayer('P1', config);
        const p2 = createInitialPlayer('P2', config);
        p1.score = players.P1.score;
        p2.score = players.P2.score;
        set({
          phase: 'countdown',
          countdown: 3,
          roundWinner: null,
          players: { P1: p1, P2: p2 },
          particles: [],
          shockwaves: [],
          roundEndTimer: 0,
        });
      },

      backToMenu: () => {
        const config = get().config;
        set({
          phase: 'menu',
          currentRound: 1,
          countdown: 0,
          roundWinner: null,
          gameWinner: null,
          players: {
            P1: createInitialPlayer('P1', config),
            P2: createInitialPlayer('P2', config),
          },
          particles: [],
          shockwaves: [],
          roundEndTimer: 0,
        });
      },

      setPlayerInput: (playerId: PlayerId, direction: Vector2) => {
        set((state) => ({
          players: {
            ...state.players,
            [playerId]: {
              ...state.players[playerId],
              inputDirection: { ...direction },
            },
          },
        }));
      },

      update: (deltaTime: number) => {
        const state = get();
        const { phase, config, arenaCenter } = state;

        if (phase === 'countdown') {
          const newCountdown = state.countdown - deltaTime / 1000;
          if (newCountdown <= 0) {
            set({ phase: 'playing', countdown: 0 });
          } else {
            const floored = Math.ceil(newCountdown);
            if (floored !== Math.ceil(state.countdown)) {
              set({ countdown: newCountdown });
            } else {
              set({ countdown: newCountdown });
            }
          }
          return;
        }

        if (phase === 'roundEnd') {
          const newTimer = state.roundEndTimer + deltaTime;
          if (newTimer >= 1600) {
            const { gameWinner, currentRound, config } = get();
            if (gameWinner) {
              set({ phase: 'gameEnd', roundEndTimer: 0 });
            } else {
              const cfg = get().config;
              const { players } = get();
              const p1 = createInitialPlayer('P1', cfg);
              const p2 = createInitialPlayer('P2', cfg);
              p1.score = players.P1.score;
              p2.score = players.P2.score;
              set({
                phase: 'countdown',
                currentRound: currentRound + 1,
                countdown: 3,
                roundWinner: null,
                players: { P1: p1, P2: p2 },
                particles: [],
                shockwaves: [],
                roundEndTimer: 0,
              });
            }
          } else {
            set({ roundEndTimer: newTimer });
          }
          return;
        }

        if (phase === 'menu' || phase === 'gameEnd') {
          return;
        }

        const deltaFactor = Math.min(deltaTime / (1000 / 60), 3);

        let p1 = updatePlayerMovement(state.players.P1, config, deltaFactor);
        let p2 = updatePlayerMovement(state.players.P2, config, deltaFactor);

        const collision = resolvePlayerCollision(p1, p2, config);
        p1 = collision.p1;
        p2 = collision.p2;

        let newParticles = updateParticles(state.particles);
        let newShockwaves = updateShockwaves(state.shockwaves);

        if (collision.result.collided && collision.result.collisionPoint) {
          const force = collision.result.impactForce;
          if (force > 1.5) {
            const waveRadius = 40 + Math.min(force * 12, 100);
            newShockwaves.push(
              createShockwave(
                collision.result.collisionPoint,
                '#a78bfa',
                waveRadius,
                24,
              ),
            );
            const burstCount = Math.min(8 + Math.floor(force * 2), 24);
            newParticles.push(
              ...createBurst(
                collision.result.collisionPoint,
                force > 6 ? '#fbbf24' : '#a78bfa',
                burstCount,
                2 + force * 0.4,
                [2, 5],
                [18, 36],
              ),
            );
          }
        }

        if (vecLength(p1.velocity) > 2) {
          newParticles.push(createTrailParticle(p1.position, p1.glowColor, p1.velocity));
        }
        if (vecLength(p2.velocity) > 2) {
          newParticles.push(createTrailParticle(p2.position, p2.glowColor, p2.velocity));
        }

        const p1Out = isPlayerOutOfBounds(
          p1.position,
          p1.radius,
          config.arenaRadius,
          arenaCenter,
        );
        const p2Out = isPlayerOutOfBounds(
          p2.position,
          p2.radius,
          config.arenaRadius,
          arenaCenter,
        );

        if (p1Out || p2Out) {
          const winnerId: PlayerId = p1Out ? 'P2' : 'P1';
          const loserId: PlayerId = p1Out ? 'P1' : 'P2';
          const winner = winnerId === 'P1' ? p1 : p2;
          const loser = loserId === 'P1' ? p1 : p2;

          const newScore = { ...state.players };
          newScore[winnerId] = {
            ...newScore[winnerId],
            score: newScore[winnerId].score + 1,
          };

          const burstPos = { ...loser.position };
          newParticles.push(
            ...createBurst(burstPos, loser.color, 40, 6, [3, 8], [40, 80]),
          );
          newParticles.push(
            ...createBurst(burstPos, loser.glowColor, 24, 4, [2, 5], [30, 60]),
          );
          newShockwaves.push(createShockwave(burstPos, winner.glowColor, 180, 40));

          const reachesWin = newScore[winnerId].score >= config.roundsToWin;
          set({
            phase: reachesWin ? 'roundEnd' : 'roundEnd',
            roundWinner: winnerId,
            gameWinner: reachesWin ? winnerId : null,
            players: {
              P1: { ...p1, score: newScore.P1.score, isAlive: !p1Out },
              P2: { ...p2, score: newScore.P2.score, isAlive: !p2Out },
            },
            particles: newParticles,
            shockwaves: newShockwaves,
            roundEndTimer: 0,
          });
          return;
        }

        set({
          players: { P1: p1, P2: p2 },
          particles: newParticles,
          shockwaves: newShockwaves,
        });
      },
    },
  };
});

export const selectPhase = (s: GameState) => s.phase;
export const selectPlayers = (s: GameState) => s.players;
export const selectParticles = (s: GameState) => s.particles;
export const selectShockwaves = (s: GameState) => s.shockwaves;
export const selectCountdown = (s: GameState) => s.countdown;
export const selectRoundInfo = (s: GameState) => ({
  currentRound: s.currentRound,
  roundsToWin: s.config.roundsToWin,
  roundWinner: s.roundWinner,
  gameWinner: s.gameWinner,
});
export const selectConfig = (s: GameState) => s.config;
export const selectArena = (s: GameState) => ({
  center: s.arenaCenter,
  radius: s.config.arenaRadius,
  size: s.canvasSize,
  dangerZoneRatio: s.config.dangerZoneRatio,
});
export const selectActions = (s: GameState) => s.actions;
