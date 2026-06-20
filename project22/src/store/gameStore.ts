import { create } from 'zustand';
import { BlockType, GameState, PlayerState, WorldState, InventorySlot } from '@/types';
import { generateTerrain, findSpawnPosition, getBlockKey } from '@/utils/terrain';
import { HOTBAR_BLOCKS, WORLD_SIZE, GAME_CONFIG } from '@/constants/blocks';

const createInitialInventory = (): InventorySlot[] => {
  return HOTBAR_BLOCKS.map((blockType) => ({
    blockType,
    count: 64,
  }));
};

const createInitialPlayerState = (spawnPos: { x: number; y: number; z: number }): PlayerState => ({
  position: { ...spawnPos },
  velocity: { x: 0, y: 0, z: 0 },
  yaw: 0,
  pitch: 0,
  onGround: false,
  health: 20,
  hunger: 20,
  selectedSlot: 0,
  inventory: createInitialInventory(),
});

const createInitialWorldState = (seed: number): WorldState => {
  const blocks = generateTerrain(seed);
  return {
    blocks,
    size: WORLD_SIZE,
    seed,
  };
};

interface GameActions {
  startGame: () => void;
  setPhase: (phase: GameState['phase']) => void;
  setPlayerPosition: (position: PlayerState['position']) => void;
  setPlayerVelocity: (velocity: PlayerState['velocity']) => void;
  setPlayerRotation: (yaw: number, pitch: number) => void;
  setOnGround: (onGround: boolean) => void;
  setSelectedSlot: (slot: number) => void;
  addToInventory: (blockType: BlockType, count?: number) => void;
  removeFromInventory: (slot: number, count?: number) => void;
  setHealth: (health: number) => void;
  setHunger: (hunger: number) => void;
  breakBlock: (x: number, y: number, z: number) => void;
  placeBlock: (x: number, y: number, z: number, blockType: BlockType) => boolean;
  respawn: () => void;
}

const initialSeed = Math.random() * 10000;
const initialWorld = createInitialWorldState(initialSeed);
const initialSpawnPos = findSpawnPosition(initialWorld.blocks);
const initialPlayer = createInitialPlayerState(initialSpawnPos);

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  phase: 'menu',
  world: initialWorld,
  player: initialPlayer,
  settings: {
    renderDistance: 16,
    mouseSensitivity: GAME_CONFIG.mouseSensitivity,
    volume: 0.5,
  },

  startGame: () => {
    const seed = Math.random() * 10000;
    const world = createInitialWorldState(seed);
    const spawnPos = findSpawnPosition(world.blocks);
    const player = createInitialPlayerState(spawnPos);
    set({ phase: 'playing', world, player });
  },

  setPhase: (phase) => set({ phase }),

  setPlayerPosition: (position) =>
    set((state) => ({
      player: { ...state.player, position },
    })),

  setPlayerVelocity: (velocity) =>
    set((state) => ({
      player: { ...state.player, velocity },
    })),

  setPlayerRotation: (yaw, pitch) =>
    set((state) => ({
      player: { ...state.player, yaw, pitch },
    })),

  setOnGround: (onGround) =>
    set((state) => ({
      player: { ...state.player, onGround },
    })),

  setSelectedSlot: (slot) =>
    set((state) => ({
      player: { ...state.player, selectedSlot: Math.max(0, Math.min(4, slot)) },
    })),

  addToInventory: (blockType, count = 1) => {
    set((state) => {
      const newInventory = [...state.player.inventory];
      
      const existingSlot = newInventory.findIndex(
        (slot) => slot.blockType === blockType && slot.count < 64
      );

      if (existingSlot !== -1) {
        newInventory[existingSlot] = {
          ...newInventory[existingSlot],
          count: Math.min(64, newInventory[existingSlot].count + count),
        };
      } else {
        const emptySlot = newInventory.findIndex((slot) => slot.blockType === null);
        if (emptySlot !== -1) {
          newInventory[emptySlot] = { blockType, count };
        }
      }

      return { player: { ...state.player, inventory: newInventory } };
    });
  },

  removeFromInventory: (slot, count = 1) => {
    set((state) => {
      const newInventory = [...state.player.inventory];
      if (newInventory[slot].count > 0) {
        const newCount = newInventory[slot].count - count;
        newInventory[slot] = {
          ...newInventory[slot],
          count: newCount,
          blockType: newCount <= 0 ? null : newInventory[slot].blockType,
        };
      }
      return { player: { ...state.player, inventory: newInventory } };
    });
  },

  setHealth: (health) =>
    set((state) => ({
      player: { ...state.player, health: Math.max(0, Math.min(20, health)) },
    })),

  setHunger: (hunger) =>
    set((state) => ({
      player: { ...state.player, hunger: Math.max(0, Math.min(20, hunger)) },
    })),

  breakBlock: (x, y, z) => {
    set((state) => {
      const key = getBlockKey(x, y, z);
      const blockType = state.world.blocks.get(key);
      
      if (!blockType || blockType === BlockType.AIR) return state;

      const newBlocks = new Map(state.world.blocks);
      newBlocks.delete(key);

      if (blockType && blockType !== BlockType.WATER) {
        const stateNow = get();
        stateNow.addToInventory(blockType);
      }

      return {
        world: { ...state.world, blocks: newBlocks },
      };
    });
  },

  placeBlock: (x, y, z, blockType) => {
    const state = get();
    const key = getBlockKey(x, y, z);
    
    if (state.world.blocks.has(key)) return false;

    const playerPos = state.player.position;
    const playerMinX = playerPos.x - 0.3;
    const playerMaxX = playerPos.x + 0.3;
    const playerMinY = playerPos.y;
    const playerMaxY = playerPos.y + 1.8;
    const playerMinZ = playerPos.z - 0.3;
    const playerMaxZ = playerPos.z + 0.3;

    const blockMinX = Math.floor(x);
    const blockMaxX = Math.floor(x) + 1;
    const blockMinY = Math.floor(y);
    const blockMaxY = Math.floor(y) + 1;
    const blockMinZ = Math.floor(z);
    const blockMaxZ = Math.floor(z) + 1;

    if (
      playerMinX < blockMaxX && playerMaxX > blockMinX &&
      playerMinY < blockMaxY && playerMaxY > blockMinY &&
      playerMinZ < blockMaxZ && playerMaxZ > blockMinZ
    ) {
      return false;
    }

    set((state) => {
      const newBlocks = new Map(state.world.blocks);
      newBlocks.set(key, blockType);
      return { world: { ...state.world, blocks: newBlocks } };
    });

    return true;
  },

  respawn: () => {
    const state = get();
    const spawnPos = findSpawnPosition(state.world.blocks);
    set((state) => ({
      player: {
        ...createInitialPlayerState(spawnPos),
        inventory: state.player.inventory,
      },
    }));
  },
}));
