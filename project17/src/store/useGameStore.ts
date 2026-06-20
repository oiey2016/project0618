import { create } from 'zustand';
import { GameStore, GameState, Item } from '../types/game';
import { scenes as initialScenes } from '../data/scenes';
import { items as initialItems } from '../data/items';
import { clues as initialClues, clueConnections as initialConnections, getConnectionBetween } from '../data/clues';
import { puzzles as initialPuzzles, getPuzzleById } from '../data/puzzles';
import { getItemById } from '../data/items';
import { getClueById } from '../data/clues';

const getInitialState = (): GameState => ({
  currentScene: 'living-room',
  inventory: JSON.parse(JSON.stringify(initialItems)),
  clues: JSON.parse(JSON.stringify(initialClues)),
  puzzles: JSON.parse(JSON.stringify(initialPuzzles)),
  scenes: JSON.parse(JSON.stringify(initialScenes)),
  clueConnections: JSON.parse(JSON.stringify(initialConnections)),
  selectedItem: null,
  dialogMessage: null,
  showClueBoard: false,
  activePuzzle: null,
  gamePhase: 'start',
  endingType: null,
  discoveredPassword: [],
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  changeScene: (sceneId: string) => {
    const state = get();
    const scene = state.scenes.find(s => s.id === sceneId);
    if (scene && scene.unlocked) {
      set({ currentScene: sceneId });
    } else if (scene && !scene.unlocked) {
      set({ dialogMessage: '这个区域还没有解锁。' });
    }
  },

  unlockScene: (sceneId: string) => {
    set(state => ({
      scenes: state.scenes.map(scene =>
        scene.id === sceneId ? { ...scene, unlocked: true } : scene
      ),
    }));
  },

  collectItem: (itemId: string) => {
    set(state => ({
      inventory: state.inventory.map(item =>
        item.id === itemId ? { ...item, collected: true } : item
      ),
    }));
  },

  selectItem: (item: Item | null) => {
    set({ selectedItem: item });
  },

  useItem: (itemId: string, targetId: string): boolean => {
    const state = get();
    const item = state.inventory.find(i => i.id === itemId);
    
    if (!item || !item.collected) return false;
    
    if (item.canUseOn.includes(targetId)) {
      return true;
    }
    
    set({ dialogMessage: '这个物品好像不能用在这里。' });
    return false;
  },

  collectClue: (clueId: string) => {
    set(state => ({
      clues: state.clues.map(clue =>
        clue.id === clueId ? { ...clue, found: true } : clue
      ),
    }));
  },

  connectClues: (clueId1: string, clueId2: string): boolean => {
    const state = get();
    const connection = getConnectionBetween(clueId1, clueId2);
    
    if (!connection) {
      set({ dialogMessage: '这两个线索之间似乎没有关联...' });
      return false;
    }
    
    if (connection.discovered) {
      set({ dialogMessage: '你已经发现了这个关联。' });
      return false;
    }

    set(state => ({
      clueConnections: state.clueConnections.map(conn =>
        (conn.from === clueId1 && conn.to === clueId2) ||
        (conn.from === clueId2 && conn.to === clueId1)
          ? { ...conn, discovered: true }
          : conn
      ),
      dialogMessage: connection.result,
      discoveredPassword: connection.unlocks?.type === 'password'
        ? [...state.discoveredPassword, connection.unlocks.value]
        : state.discoveredPassword,
    }));
    
    return true;
  },

  startPuzzle: (puzzleId: string) => {
    const puzzle = getPuzzleById(puzzleId);
    if (puzzle && !puzzle.solved) {
      set(state => ({
        activePuzzle: state.puzzles.find(p => p.id === puzzleId) || null,
      }));
    }
  },

  closePuzzle: () => {
    set({ activePuzzle: null });
  },

  solvePuzzle: (puzzleId: string, answer: string | string[]): boolean => {
    const state = get();
    const puzzle = state.puzzles.find(p => p.id === puzzleId);
    
    if (!puzzle) return false;
    
    let isCorrect = false;
    if (puzzle.type === 'password' && typeof answer === 'string') {
      isCorrect = answer === puzzle.answer;
    } else if (puzzle.type === 'sequence' && Array.isArray(answer)) {
      isCorrect = JSON.stringify(answer) === JSON.stringify(puzzle.answer);
    } else if (puzzle.type === 'mechanism' && Array.isArray(answer) && Array.isArray(puzzle.answer)) {
      isCorrect = puzzle.answer.every(a => answer.includes(a));
    }
    
    if (isCorrect) {
      set(state => ({
        puzzles: state.puzzles.map(p =>
          p.id === puzzleId ? { ...p, solved: true } : p
        ),
        activePuzzle: null,
      }));
      
      const reward = puzzle.reward;
      if (reward.type === 'item') {
        get().collectItem(reward.targetId);
        const item = getItemById(reward.targetId);
        set({ dialogMessage: `你获得了：${item?.name}！` });
      } else if (reward.type === 'clue') {
        get().collectClue(reward.targetId);
        const clue = getClueById(reward.targetId);
        set({ dialogMessage: `你发现了新线索：${clue?.title}！` });
      } else if (reward.type === 'scene') {
        get().unlockScene(reward.targetId);
        const scene = state.scenes.find(s => s.id === reward.targetId);
        set({ dialogMessage: `新区域已解锁：${scene?.name}！` });
      } else if (reward.type === 'ending') {
        get().endGame(reward.targetId as 'success' | 'fail');
      }
      
      return true;
    } else {
      set({ dialogMessage: puzzle.hint });
      return false;
    }
  },

  showDialog: (message: string) => {
    set({ dialogMessage: message });
  },

  hideDialog: () => {
    set({ dialogMessage: null });
  },

  toggleClueBoard: () => {
    set(state => ({ showClueBoard: !state.showClueBoard }));
  },

  startGame: () => {
    set({
      ...getInitialState(),
      gamePhase: 'playing',
    });
  },

  endGame: (type: 'success' | 'fail') => {
    set({
      gamePhase: 'ending',
      endingType: type,
    });
  },

  resetGame: () => {
    set(getInitialState());
  },

  getHint: (): string => {
    const state = get();
    const unsolvedPuzzle = state.puzzles.find(p => !p.solved);
    if (unsolvedPuzzle) {
      return unsolvedPuzzle.hint;
    }
    return '你似乎已经解开了所有谜题，试着逃离这里吧！';
  },
}));
