import { create } from 'zustand';
import type { GameState, Player, Ghost, Dialog, Interactable, Room } from '@/types/game';
import { ROOMS, ITEMS, PUZZLES, INITIAL_PLAYER, INITIAL_GHOST, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/game/gameData';

interface GameStore {
  gameState: GameState;
  player: Player;
  ghost: Ghost;
  currentRoom: string;
  rooms: Record<string, Room>;
  collectedItems: string[];
  solvedPuzzles: string[];
  unlockedDoors: string[];
  dialog: Dialog;
  activePuzzleId: string | null;
  selectedItemId: string | null;
  showHint: boolean;
  showGameInstructions: boolean;
  transitionAlpha: number;
  isTransitioning: boolean;
  score: number;

  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  goToMenu: () => void;
  showInstructions: () => void;
  hideInstructions: () => void;

  setPlayerTarget: (x: number, y: number) => void;
  updatePlayerPosition: (x: number, y: number, facing: 'left' | 'right') => void;
  updateGhostPosition: (x: number, y: number, state: Ghost['state'], alertLevel: number, floatOffset: number) => void;
  setGhostPatrolPath: (path: { x: number; y: number }[]) => void;
  setGhostTarget: (x: number, y: number) => void;
  setGhostPatrolIndex: (index: number) => void;
  setGhostRoom: (roomId: string) => void;

  collectItem: (itemId: string) => void;
  selectItem: (itemId: string | null) => void;
  hasItem: (itemId: string) => boolean;
  removeItem: (itemId: string) => void;

  interactWith: (interactableId: string) => void;
  solvePuzzle: (puzzleId: string) => boolean;
  checkPuzzleSolution: (puzzleId: string, input: string) => boolean;
  unlockDoor: (doorId: string) => void;
  isDoorUnlocked: (doorId: string) => boolean;

  showDialog: (text: string, speaker?: string) => void;
  hideDialog: () => void;

  openPuzzle: (puzzleId: string) => void;
  closePuzzle: () => void;

  setPlayerHidden: (hidden: boolean) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;

  changeRoom: (roomId: string, fromDirection?: string) => void;
  getCurrentRoom: () => Room | undefined;
  getInteractable: (id: string) => Interactable | undefined;
  updateInteractable: (id: string, updates: Partial<Interactable>) => void;

  setTransitioning: (transitioning: boolean, alpha?: number) => void;
  setTransitionAlpha: (alpha: number) => void;

  setVictory: () => void;
  setGameOver: () => void;

  toggleHint: () => void;
  openGameInstructions: () => void;
  closeGameInstructions: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'menu',
  player: { ...INITIAL_PLAYER },
  ghost: { ...INITIAL_GHOST },
  currentRoom: 'entrance',
  rooms: JSON.parse(JSON.stringify(ROOMS)),
  collectedItems: [],
  solvedPuzzles: [],
  unlockedDoors: [],
  dialog: { visible: false, text: '' },
  activePuzzleId: null,
  selectedItemId: null,
  showHint: false,
  showGameInstructions: false,
  transitionAlpha: 0,
  isTransitioning: false,
  score: 0,

  startGame: () => {
    const freshRooms = JSON.parse(JSON.stringify(ROOMS));
    set({
      gameState: 'playing',
      player: { ...INITIAL_PLAYER },
      ghost: { ...INITIAL_GHOST },
      currentRoom: 'entrance',
      rooms: freshRooms,
      collectedItems: [],
      solvedPuzzles: [],
      unlockedDoors: [],
      dialog: { visible: false, text: '' },
      activePuzzleId: null,
      selectedItemId: null,
      showHint: false,
      score: 0,
      transitionAlpha: 0,
      isTransitioning: false,
    });
    setTimeout(() => {
      get().showDialog('你醒来时发现自己身处一个奇怪的微缩屋中...\n四周一片昏暗，空气中弥漫着诡异的气息。\n点击地面移动，点击物品互动。\n小心游荡的鬼怪！', '旁白');
    }, 500);
  },

  pauseGame: () => set({ gameState: 'paused' }),
  resumeGame: () => set({ gameState: 'playing' }),
  goToMenu: () => set({ gameState: 'menu' }),
  showInstructions: () => set({ gameState: 'instructions' }),
  hideInstructions: () => set({ gameState: 'menu' }),

  setPlayerTarget: (x: number, y: number) => {
    const clampedX = Math.max(30, Math.min(CANVAS_WIDTH - 30, x));
    const clampedY = Math.max(50, Math.min(CANVAS_HEIGHT - 30, y));
    set((state) => ({
      player: {
        ...state.player,
        targetPosition: { x: clampedX, y: clampedY },
        facing: x > state.player.position.x ? 'right' : 'left',
      },
    }));
  },

  updatePlayerPosition: (x: number, y: number, facing: 'left' | 'right') => {
    set((state) => ({
      player: { ...state.player, position: { x, y }, facing },
    }));
  },

  updateGhostPosition: (x: number, y: number, state: Ghost['state'], alertLevel: number, floatOffset: number) => {
    set((s) => ({
      ghost: { ...s.ghost, position: { x, y }, state, alertLevel, floatOffset },
    }));
  },

  setGhostPatrolPath: (path: { x: number; y: number }[]) => {
    set((s) => ({
      ghost: { ...s.ghost, patrolPath: path, patrolIndex: 0, targetPosition: path[0] },
    }));
  },

  setGhostTarget: (x: number, y: number) => {
    set((s) => ({
      ghost: { ...s.ghost, targetPosition: { x, y } },
    }));
  },

  setGhostPatrolIndex: (index: number) => {
    set((s) => ({ ghost: { ...s.ghost, patrolIndex: index } }));
  },

  setGhostRoom: (roomId: string) => {
    const room = ROOMS[roomId];
    if (room && room.ghostPatrolPath) {
      const path = room.ghostPatrolPath;
      set((s) => ({
        ghost: {
          ...s.ghost,
          currentRoom: roomId,
          position: { ...path[0] },
          targetPosition: { ...path[1] },
          patrolPath: path,
          patrolIndex: 1,
          state: 'patrol',
        },
      }));
    }
  },

  collectItem: (itemId: string) => {
    const state = get();
    if (state.collectedItems.includes(itemId)) return;
    
    const item = ITEMS[itemId];
    if (item) {
      set((s) => ({
        collectedItems: [...s.collectedItems, itemId],
        player: { ...s.player, inventory: [...s.player.inventory, itemId] },
        score: s.score + 100,
      }));
      get().showDialog(`获得物品：${item.name}\n${item.description}`, '提示');
    }
  },

  selectItem: (itemId: string | null) => {
    set({ selectedItemId: itemId });
  },

  hasItem: (itemId: string) => {
    return get().collectedItems.includes(itemId);
  },

  removeItem: (itemId: string) => {
    set((s) => ({
      collectedItems: s.collectedItems.filter((id) => id !== itemId),
      player: {
        ...s.player,
        inventory: s.player.inventory.filter((id) => id !== itemId),
      },
      selectedItemId: s.selectedItemId === itemId ? null : s.selectedItemId,
    }));
  },

  interactWith: (interactableId: string) => {
    const state = get();
    const room = state.rooms[state.currentRoom];
    if (!room) return;

    const interactable = room.interactables.find((i: Interactable) => i.id === interactableId);
    if (!interactable) return;

    if (interactable.type === 'item' && !interactable.collected && interactable.givesItem) {
      get().collectItem(interactable.givesItem);
      get().updateInteractable(interactableId, { collected: true, visible: false });
      return;
    }

    if (interactable.type === 'furniture' && interactable.givesItem && !interactable.collected) {
      get().collectItem(interactable.givesItem);
      get().updateInteractable(interactableId, { collected: true });
      return;
    }

    if (interactable.type === 'exit' || interactable.leadsTo) {
      if (interactable.locked) {
        if (interactable.requiresItem && state.selectedItemId === interactable.requiresItem) {
          get().removeItem(interactable.requiresItem);
          get().unlockDoor(interactableId);
          get().updateInteractable(interactableId, { locked: false });
          get().showDialog('门开了！', '提示');
          return;
        }
        if (interactable.puzzleId) {
          if (state.solvedPuzzles.includes(interactable.puzzleId)) {
            get().unlockDoor(interactableId);
            get().updateInteractable(interactableId, { locked: false });
            get().changeRoom(interactable.leadsTo!);
            return;
          }
          get().showDialog('这扇门似乎需要解开某个谜题才能打开...', '提示');
          return;
        }
        if (interactable.requiresItem) {
          const item = ITEMS[interactable.requiresItem];
          get().showDialog(`这扇门锁住了，需要${item ? item.name : '钥匙'}。`, '提示');
          return;
        }
      } else {
        if (interactable.leadsTo === 'victory') {
          if (interactable.requiresItem) {
            if (state.selectedItemId === interactable.requiresItem) {
              get().setVictory();
              return;
            }
            const item = ITEMS[interactable.requiresItem];
            get().showDialog(`这扇门需要${item ? item.name : '特殊的钥匙'}才能打开。`, '提示');
            return;
          }
          get().setVictory();
          return;
        }
        get().changeRoom(interactable.leadsTo!);
        return;
      }
    }

    if (interactable.type === 'puzzle' && interactable.puzzleId) {
      if (state.solvedPuzzles.includes(interactable.puzzleId)) {
        get().showDialog('这个谜题已经解开了。', '提示');
        return;
      }
      get().openPuzzle(interactable.puzzleId);
      return;
    }

    if (interactable.type === 'hidingSpot') {
      get().setPlayerHidden(true);
      const duration = interactable.hideDuration || 3000;
      get().showDialog('你屏住呼吸，躲了起来...', '提示');
      setTimeout(() => {
        get().setPlayerHidden(false);
        get().hideDialog();
      }, duration);
      return;
    }

    if (interactable.description) {
      get().showDialog(interactable.description, interactable.name);
    }
  },

  solvePuzzle: (puzzleId: string) => {
    const state = get();
    if (state.solvedPuzzles.includes(puzzleId)) return false;

    const puzzle = PUZZLES[puzzleId];
    if (!puzzle) return false;

    set((s) => ({
      solvedPuzzles: [...s.solvedPuzzles, puzzleId],
      score: s.score + 300,
    }));

    if (puzzle.rewardItemId) {
      setTimeout(() => {
        get().collectItem(puzzle.rewardItemId!);
      }, 800);
    }

    if (puzzle.unlocksDoorId) {
      get().unlockDoor(puzzle.unlocksDoorId);
    }

    return true;
  },

  checkPuzzleSolution: (puzzleId: string, input: string) => {
    const puzzle = PUZZLES[puzzleId];
    if (!puzzle) return false;
    return puzzle.solution.toLowerCase() === input.toLowerCase();
  },

  unlockDoor: (doorId: string) => {
    set((s) => {
      const newRooms = { ...s.rooms };
      for (const roomId of Object.keys(newRooms)) {
        const room = newRooms[roomId];
        const doorIndex = room.interactables.findIndex((i: Interactable) => i.id === doorId);
        if (doorIndex !== -1) {
          newRooms[roomId] = {
            ...room,
            interactables: room.interactables.map((i: Interactable, idx: number) =>
              idx === doorIndex ? { ...i, locked: false } : i
            ),
          };
        }
      }
      return {
        unlockedDoors: [...s.unlockedDoors, doorId],
        rooms: newRooms,
      };
    });
  },

  isDoorUnlocked: (doorId: string) => {
    return get().unlockedDoors.includes(doorId);
  },

  showDialog: (text: string, speaker?: string) => {
    set({
      dialog: { visible: true, text, speaker },
      gameState: 'dialog',
    });
  },

  hideDialog: () => {
    set({
      dialog: { visible: false, text: '', speaker: undefined },
      gameState: 'playing',
    });
  },

  openPuzzle: (puzzleId: string) => {
    set({ activePuzzleId: puzzleId, gameState: 'puzzle' });
  },

  closePuzzle: () => {
    set({ activePuzzleId: null, gameState: 'playing' });
  },

  setPlayerHidden: (hidden: boolean) => {
    set((s) => ({ player: { ...s.player, isHidden: hidden } }));
  },

  damagePlayer: (amount: number) => {
    set((s) => {
      const newHealth = Math.max(0, s.player.health - amount);
      if (newHealth <= 0) {
        setTimeout(() => get().setGameOver(), 500);
      }
      return { player: { ...s.player, health: newHealth } };
    });
  },

  healPlayer: (amount: number) => {
    set((s) => ({
      player: {
        ...s.player,
        health: Math.min(s.player.maxHealth, s.player.health + amount),
      },
    }));
  },

  changeRoom: (roomId: string) => {
    const state = get();
    if (!ROOMS[roomId]) return;

    set({ isTransitioning: true, transitionAlpha: 0 });
    
    let alpha = 0;
    const fadeOut = setInterval(() => {
      alpha += 0.05;
      if (alpha >= 1) {
        clearInterval(fadeOut);
        const newRoom = ROOMS[roomId];
        const startPos = newRoom.playerStart;
        
        set((s) => ({
          currentRoom: roomId,
          player: {
            ...s.player,
            currentRoom: roomId,
            position: { ...startPos },
            targetPosition: { ...startPos },
          },
          transitionAlpha: 1,
        }));

        if (newRoom.ghostPatrolPath) {
          if (Math.random() > 0.5) {
            get().setGhostRoom(roomId);
          }
        }

        let fadeInAlpha = 1;
        const fadeIn = setInterval(() => {
          fadeInAlpha -= 0.05;
          if (fadeInAlpha <= 0) {
            clearInterval(fadeIn);
            set({ isTransitioning: false, transitionAlpha: 0 });
          } else {
            set({ transitionAlpha: fadeInAlpha });
          }
        }, 30);
      } else {
        set({ transitionAlpha: alpha });
      }
    }, 30);
  },

  getCurrentRoom: () => {
    return get().rooms[get().currentRoom];
  },

  getInteractable: (id: string) => {
    const room = get().getCurrentRoom();
    return room?.interactables.find((i: Interactable) => i.id === id);
  },

  updateInteractable: (id: string, updates: Partial<Interactable>) => {
    set((s) => {
      const newRooms = { ...s.rooms };
      const room = newRooms[s.currentRoom];
      if (room) {
        newRooms[s.currentRoom] = {
          ...room,
          interactables: room.interactables.map((i: Interactable) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        };
      }
      return { rooms: newRooms };
    });
  },

  setTransitioning: (transitioning: boolean, alpha = 0) => {
    set({ isTransitioning: transitioning, transitionAlpha: alpha });
  },

  setTransitionAlpha: (alpha: number) => {
    set({ transitionAlpha: alpha });
  },

  setVictory: () => {
    set((s) => ({ gameState: 'victory', score: s.score + 1000 }));
  },

  setGameOver: () => {
    set({ gameState: 'gameover' });
  },

  toggleHint: () => {
    set((s) => ({ showHint: !s.showHint }));
  },

  openGameInstructions: () => {
    set({ showGameInstructions: true });
  },

  closeGameInstructions: () => {
    set({ showGameInstructions: false });
  },
}));
