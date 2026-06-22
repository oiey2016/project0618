import { create } from 'zustand';
import { GameState } from '../types/game';
import { dishes, getGuestById, guests } from '../data/guests';
import { getPuzzleById } from '../data/puzzles';
import { getSceneById, inspectTexts } from '../data/scenes';
import { getItemById } from '../data/items';

export const useGameStore = create<GameState>((set, get) => ({
  currentScene: 'hall',
  inventory: [],
  selectedItem: null,
  solvedPuzzles: [],
  collectedItems: [],
  servedGuests: [],
  currentDialogue: null,
  dialogueSpeaker: null,
  showingPuzzle: null,
  showingGuide: false,
  gamePhase: 'start',
  hintsRemaining: 3,
  sceneTransitioning: false,
  flags: {},

  changeScene: (sceneId: string) => {
    const scene = getSceneById(sceneId);
    if (!scene) return;
    
    set({ sceneTransitioning: true });
    
    setTimeout(() => {
      set({ 
        currentScene: sceneId, 
        sceneTransitioning: false,
        selectedItem: null 
      });
    }, 500);
  },

  collectItem: (itemId: string) => {
    const { inventory, collectedItems } = get();
    const item = getItemById(itemId);
    
    if (!item || inventory.includes(itemId)) return;
    
    set({
      inventory: [...inventory, itemId],
      collectedItems: [...collectedItems, itemId],
    });

    get().showDialogue(`获得物品：${item.name}`, '系统');
  },

  selectItem: (itemId: string | null) => {
    set({ selectedItem: itemId });
  },

  useItem: (itemId: string, targetId: string): boolean => {
    const puzzle = getPuzzleById(targetId);
    
    if (puzzle && puzzle.type === 'item_use' && puzzle.requiredItem === itemId) {
      get().solvePuzzle(targetId);
      set({ selectedItem: null });
      return true;
    }
    
    get().showDialogue('好像没什么反应...', '系统');
    return false;
  },

  combineItems: (item1: string, item2: string): boolean => {
    const dishEntries = Object.entries(dishes);
    
    for (const [dishId, dish] of dishEntries) {
      const ingredients = dish.ingredients;
      if (
        (ingredients.includes(item1) && ingredients.includes(item2)) &&
        ingredients.length === 2
      ) {
        const { inventory } = get();
        
        set({
          inventory: inventory.filter(i => i !== item1 && i !== item2).concat(dishId),
          selectedItem: null,
        });
        
        get().showDialogue(`制作完成：${dish.name}！`, '系统');
        return true;
      }
    }
    
    get().showDialogue('这两样东西没法组合...', '系统');
    return false;
  },

  solvePuzzle: (puzzleId: string) => {
    const { solvedPuzzles } = get();
    const puzzle = getPuzzleById(puzzleId);
    
    if (!puzzle || solvedPuzzles.includes(puzzleId)) return;
    
    set({
      solvedPuzzles: [...solvedPuzzles, puzzleId],
      showingPuzzle: null,
    });
    
    const flagKey = `${puzzleId}_solved`;
    get().setFlag(flagKey, true);
    
    if (puzzle.reward) {
      const rewardItem = getItemById(puzzle.reward);
      if (rewardItem) {
        setTimeout(() => {
          get().collectItem(puzzle.reward);
        }, 500);
      }
    }
    
    get().showDialogue(`谜题解开了！${puzzle.hint || ''}`, '系统');
  },

  openPuzzle: (puzzleId: string) => {
    const { solvedPuzzles } = get();
    if (solvedPuzzles.includes(puzzleId)) {
      get().showDialogue('这个谜题已经解开了。', '系统');
      return;
    }
    set({ showingPuzzle: puzzleId });
  },

  closePuzzle: () => {
    set({ showingPuzzle: null });
  },

  openGuide: () => {
    set({ showingGuide: true });
  },

  closeGuide: () => {
    set({ showingGuide: false });
  },

  serveDish: (guestId: string) => {
    const { servedGuests, inventory } = get();
    const guest = getGuestById(guestId);
    
    if (!guest || servedGuests.includes(guestId)) return;
    
    const hasDish = inventory.includes(guest.requiredDish);
    
    if (hasDish) {
      const newServedGuests = [...servedGuests, guestId];
      set({
        inventory: inventory.filter(i => i !== guest.requiredDish),
        servedGuests: newServedGuests,
        selectedItem: null,
      });
      
      get().showDialogue(`${guest.name}享用了晚餐...`, '系统');
      
      const totalGuests = Object.keys(guests).length;
      if (newServedGuests.length >= totalGuests) {
        setTimeout(() => {
          set({ gamePhase: 'ending' });
        }, 2000);
      }
    } else {
      get().showDialogue(`你还没有准备好${guest.name}的晚餐...`, '系统');
    }
  },

  showDialogue: (text: string, speaker?: string) => {
    set({
      currentDialogue: text,
      dialogueSpeaker: speaker || null,
    });
  },

  closeDialogue: () => {
    set({
      currentDialogue: null,
      dialogueSpeaker: null,
    });
  },

  startGame: () => {
    set({
      gamePhase: 'playing',
      currentScene: 'hall',
      inventory: [],
      selectedItem: null,
      solvedPuzzles: [],
      collectedItems: [],
      servedGuests: [],
      currentDialogue: '欢迎来到暗夜旅馆，侍者。今晚有三位特殊的客人，他们都在等待自己的晚餐。你的任务是：探索旅馆，收集食材，为每位客人准备一份特制的晚餐。祝你好运...',
      dialogueSpeaker: '旁白',
      showingPuzzle: null,
      showingGuide: false,
      hintsRemaining: 3,
      flags: {},
    });
  },

  resetGame: () => {
    set({
      gamePhase: 'start',
      currentScene: 'hall',
      inventory: [],
      selectedItem: null,
      solvedPuzzles: [],
      collectedItems: [],
      servedGuests: [],
      currentDialogue: null,
      dialogueSpeaker: null,
      showingPuzzle: null,
      showingGuide: false,
      hintsRemaining: 3,
      flags: {},
    });
  },

  useHint: (): string | null => {
    const { hintsRemaining, currentScene } = get();
    
    if (hintsRemaining <= 0) {
      get().showDialogue('提示次数已经用完了...', '系统');
      return null;
    }
    
    const scene = getSceneById(currentScene);
    if (!scene) return null;
    
    const unsolvedHotspots = scene.hotspots.filter(h => {
      if (h.type === 'puzzle') {
        const puzzle = getPuzzleById(h.targetId);
        return puzzle && !get().solvedPuzzles.includes(puzzle.id);
      }
      if (h.type === 'item') {
        return !get().collectedItems.includes(h.targetId);
      }
      return false;
    });
    
    if (unsolvedHotspots.length > 0) {
      const hint = unsolvedHotspots[0];
      set({ hintsRemaining: hintsRemaining - 1 });
      const hintText = `提示：试试${hint.hint || '看看那个地方'}...`;
      get().showDialogue(hintText, '系统');
      return hintText;
    }
    
    get().showDialogue('这个房间里暂时没什么可探索的了...', '系统');
    return null;
  },

  setFlag: (key: string, value: boolean) => {
    set(state => ({
      flags: { ...state.flags, [key]: value },
    }));
  },

  getFlag: (key: string): boolean => {
    return get().flags[key] || false;
  },
}));
