import { create } from 'zustand';
import { GameState, GameActions, ChatMessage, StateEffects, Item } from '../types';
import { START_NODE_ID } from '../data/story';
import { resetEngineState } from '../hooks/useGameEngine';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const initialState: GameState = {
  health: 100,
  hunger: 80,
  trust: 50,
  inventory: [],
  currentNodeId: START_NODE_ID,
  messageHistory: [],
  isGameOver: false,
  endingType: undefined,
  endingTitle: undefined,
  endingDescription: undefined,
  flags: {},
  awaitingChoice: false,
  typing: false,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  addMessage: (msg) => {
    const fullMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };
    set((state) => ({ messageHistory: [...state.messageHistory, fullMsg] }));
  },

  applyEffects: (effects: StateEffects) => {
    set((state) => {
      const newState = { ...state };
      if (effects.health !== undefined) {
        newState.health = clamp(state.health + effects.health, 0, 100);
      }
      if (effects.hunger !== undefined) {
        newState.hunger = clamp(state.hunger + effects.hunger, 0, 100);
      }
      if (effects.trust !== undefined) {
        newState.trust = clamp(state.trust + effects.trust, 0, 100);
      }
      return newState;
    });
    get().checkDeath();
  },

  addItem: (item: Item) => {
    set((state) => {
      if (state.inventory.some((i) => i.id === item.id)) return state;
      return { inventory: [...state.inventory, item] };
    });
  },

  setCurrentNode: (nodeId: string) => {
    set({ currentNodeId: nodeId });
  },

  setAwaitingChoice: (v: boolean) => {
    set({ awaitingChoice: v });
  },

  setTyping: (v: boolean) => {
    set({ typing: v });
  },

  triggerEnding: (type: string, title: string, description: string) => {
    set({
      isGameOver: true,
      endingType: type,
      endingTitle: title,
      endingDescription: description,
    });
  },

  setFlag: (key: string, value: boolean) => {
    set((state) => ({ flags: { ...state.flags, [key]: value } }));
  },

  resetGame: () => {
    resetEngineState();
    set(initialState);
  },

  checkDeath: () => {
    const { health, hunger, trust, isGameOver, triggerEnding } = get();
    if (isGameOver) return;
    if (health <= 0) {
      triggerEnding(
        'death',
        '信号中断',
        '零的伤势太重了...通讯器里传来她越来越弱的呼吸声，然后是永恒的静默。你没能救她。'
      );
    } else if (hunger <= 0) {
      triggerEnding(
        'death',
        '耗尽',
        '零在黑暗中又冷又饿。她的消息越来越短，间隔越来越长...直到再也没有回复。'
      );
    } else if (trust <= 0) {
      triggerEnding(
        'death',
        '孤独的终焉',
        '零不再相信你。她关闭了通讯器，独自面对未知的黑暗。你再也不知道她后来怎样了。'
      );
    }
  },
}));
