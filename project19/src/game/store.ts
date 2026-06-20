import { create } from 'zustand';
import {
  GameState,
  GamePhase,
  Player,
  Enemy,
  Key,
  HidingSpot,
  Wall,
  Door,
  GameStats,
  Particle,
  InputState,
} from './types';
import {
  PLAYER_SPEED,
  PLAYER_VIEW_DISTANCE,
  PLAYER_VIEW_ANGLE,
  PLAYER_SIZE,
  ENEMY_SPEED_PATROL,
  ENEMY_VIEW_DISTANCE,
  ENEMY_VIEW_ANGLE,
  ENEMY_SIZE,
  TOTAL_KEYS,
  KEY_SIZE,
  createWalls,
  createPatrolPath,
  createKeyPositions,
  createHidingSpots,
  DOOR_POSITION,
} from './constants';

interface GameStore extends GameState {
  input: InputState;
  setPhase: (phase: GamePhase) => void;
  setPlayer: (player: Partial<Player>) => void;
  setEnemy: (enemy: Partial<Enemy>) => void;
  collectKey: (keyId: number) => void;
  setIsHiding: (isHiding: boolean, spot: HidingSpot | null) => void;
  setIsChasing: (isChasing: boolean) => void;
  addParticle: (particle: Particle) => void;
  updateParticles: (dt: number) => void;
  setScreenShake: (amount: number) => void;
  setFlashEffect: (color: string, alpha: number) => void;
  updateGameTime: (dt: number) => void;
  incrementStat: (stat: keyof GameStats, amount?: number) => void;
  setNearbyHidingSpot: (spot: HidingSpot | null) => void;
  setNearbyKey: (key: Key | null) => void;
  setCanInteract: (can: boolean) => void;
  resetGame: () => void;
  setInput: (input: Partial<InputState>) => void;
}

const createInitialPlayer = (): Player => ({
  x: 100,
  y: 650,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
  rotation: -Math.PI / 2,
  speed: PLAYER_SPEED,
  viewDistance: PLAYER_VIEW_DISTANCE,
  viewAngle: PLAYER_VIEW_ANGLE,
  velocityX: 0,
  velocityY: 0,
});

const createInitialEnemy = (): Enemy => ({
  x: 800,
  y: 100,
  width: ENEMY_SIZE,
  height: ENEMY_SIZE,
  rotation: 0,
  speed: ENEMY_SPEED_PATROL,
  viewDistance: ENEMY_VIEW_DISTANCE,
  viewAngle: ENEMY_VIEW_ANGLE,
  state: 'patrol',
  patrolPath: createPatrolPath(),
  currentPathIndex: 0,
  lastSeenPlayerPos: null,
  searchTimer: 0,
  waitTimer: 0,
});

const createInitialKeys = (): Key[] => {
  return createKeyPositions().map((pos) => ({
    x: pos.x,
    y: pos.y,
    width: KEY_SIZE,
    height: KEY_SIZE,
    rotation: 0,
    collected: false,
    id: pos.id,
  }));
};

const createInitialHidingSpots = (): HidingSpot[] => {
  return createHidingSpots().map((spot) => ({
    ...spot,
    rotation: 0,
    occupied: false,
  }));
};

const createInitialDoor = (): Door => ({
  ...DOOR_POSITION,
  rotation: 0,
  unlocked: false,
});

const createInitialStats = (): GameStats => ({
  playTime: 0,
  hideCount: 0,
  nearMissCount: 0,
  keysCollected: 0,
});

const createInitialState = (): Omit<GameStore, keyof { [K in keyof GameStore as GameStore[K] extends Function ? K : never]: GameStore[K] }> => ({
  phase: 'start',
  player: createInitialPlayer(),
  enemy: createInitialEnemy(),
  keys: createInitialKeys(),
  hidingSpots: createInitialHidingSpots(),
  walls: createWalls() as Wall[],
  door: createInitialDoor(),
  collectedKeys: 0,
  isHiding: false,
  currentHidingSpot: null,
  isChasing: false,
  gameTime: 0,
  stats: createInitialStats(),
  particles: [],
  screenShake: 0,
  flashEffect: { color: '#000000', alpha: 0 },
  nearbyHidingSpot: null,
  nearbyKey: null,
  canInteract: false,
  input: { up: false, down: false, left: false, right: false, action: false },
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  setPhase: (phase) => set({ phase }),

  setPlayer: (player) =>
    set((state) => ({ player: { ...state.player, ...player } })),

  setEnemy: (enemy) =>
    set((state) => ({ enemy: { ...state.enemy, ...enemy } })),

  collectKey: (keyId) =>
    set((state) => {
      const newKeys = state.keys.map((k) =>
        k.id === keyId ? { ...k, collected: true } : k
      );
      const newCollected = state.collectedKeys + 1;
      const newDoor = { ...state.door, unlocked: newCollected >= TOTAL_KEYS };
      return {
        keys: newKeys,
        collectedKeys: newCollected,
        door: newDoor,
        stats: { ...state.stats, keysCollected: newCollected },
      };
    }),

  setIsHiding: (isHiding, spot) =>
    set((state) => {
      const newSpots = state.hidingSpots.map((s) => {
        if (state.currentHidingSpot && s.id === state.currentHidingSpot.id) {
          return { ...s, occupied: false };
        }
        if (spot && s.id === spot.id) {
          return { ...s, occupied: true };
        }
        return s;
      });

      let newPlayer = { ...state.player };
      if (isHiding && spot) {
        newPlayer.x = spot.x + spot.width / 2 - state.player.width / 2;
        newPlayer.y = spot.y + spot.height / 2 - state.player.height / 2;
      }

      return {
        isHiding,
        currentHidingSpot: spot,
        hidingSpots: newSpots,
        player: newPlayer,
      };
    }),

  setIsChasing: (isChasing) => set({ isChasing }),

  addParticle: (particle) =>
    set((state) => ({ particles: [...state.particles, particle] })),

  updateParticles: (dt) =>
    set((state) => ({
      particles: state.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life - dt * 1000,
        }))
        .filter((p) => p.life > 0),
    })),

  setScreenShake: (amount) => set({ screenShake: amount }),

  setFlashEffect: (color, alpha) =>
    set({ flashEffect: { color, alpha } }),

  updateGameTime: (dt) =>
    set((state) => ({
      gameTime: state.gameTime + dt,
      stats: { ...state.stats, playTime: state.stats.playTime + dt },
    })),

  incrementStat: (stat, amount = 1) =>
    set((state) => ({
      stats: { ...state.stats, [stat]: state.stats[stat] + amount },
    })),

  setNearbyHidingSpot: (spot) => set({ nearbyHidingSpot: spot }),

  setNearbyKey: (key) => set({ nearbyKey: key }),

  setCanInteract: (can) => set({ canInteract: can }),

  setInput: (input) =>
    set((state) => ({ input: { ...state.input, ...input } })),

  resetGame: () => set(createInitialState()),
}));
