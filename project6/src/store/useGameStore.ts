import { create } from 'zustand';
import type { GameStore, Message, AstronautStatus, StoryChoice } from '@/types/game';
import { INITIAL_STATUS } from '@/types/game';
import { storyNodes, START_NODE_ID, DEATH_NODES } from '@/data/story';
import { saveGame, loadGame, clearSave } from '@/utils/storage';
import { generateId, clamp } from '@/utils/format';

let messageTimer: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<GameStore>((set, get) => ({
  isStarted: false,
  currentNodeId: '',
  messages: [],
  astronautStatus: { ...INITIAL_STATUS },
  choices: [],
  startTime: 0,
  isTyping: false,
  awaitingChoice: false,
  currentChoices: [],
  endingData: undefined,

  resetGame: () => {
    if (messageTimer) clearTimeout(messageTimer);
    clearSave();
    set({
      isStarted: false,
      currentNodeId: '',
      messages: [],
      astronautStatus: { ...INITIAL_STATUS },
      choices: [],
      startTime: 0,
      isTyping: false,
      awaitingChoice: false,
      currentChoices: [],
      endingData: undefined,
    });
  },

  startNewGame: () => {
    if (messageTimer) clearTimeout(messageTimer);
    clearSave();
    set({
      isStarted: true,
      currentNodeId: START_NODE_ID,
      messages: [],
      astronautStatus: { ...INITIAL_STATUS },
      choices: [],
      startTime: Date.now(),
      isTyping: false,
      awaitingChoice: false,
      currentChoices: [],
      endingData: undefined,
    });
    setTimeout(() => get().processNode(START_NODE_ID), 500);
  },

  loadGame: () => {
    const saved = loadGame();
    if (!saved || !saved.currentNodeId) return false;
    
    set({
      isStarted: true,
      currentNodeId: saved.currentNodeId || START_NODE_ID,
      messages: saved.messages || [],
      astronautStatus: saved.astronautStatus || { ...INITIAL_STATUS },
      choices: saved.choices || [],
      startTime: saved.startTime || Date.now(),
      isTyping: false,
      awaitingChoice: false,
      currentChoices: [],
      endingData: saved.endingData,
    });
    return true;
  },

  saveGame: () => {
    const state = get();
    saveGame({
      currentNodeId: state.currentNodeId,
      messages: state.messages,
      astronautStatus: state.astronautStatus,
      choices: state.choices,
      startTime: state.startTime,
      endingData: state.endingData,
    });
  },

  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    get().saveGame();
  },

  setTyping: (typing: boolean) => {
    set({ isTyping: typing });
  },

  applyStatusEffect: (effect: Partial<AstronautStatus>) => {
    set((state) => {
      const status = { ...state.astronautStatus };
      if (effect.health !== undefined) status.health = clamp(status.health + effect.health, 0, 100);
      if (effect.oxygen !== undefined) status.oxygen = clamp(status.oxygen + effect.oxygen, 0, 100);
      if (effect.stamina !== undefined) status.stamina = clamp(status.stamina + effect.stamina, 0, 100);
      if (effect.signal !== undefined) status.signal = clamp(status.signal + effect.signal, 0, 100);
      return { astronautStatus: status };
    });
  },

  checkDeath: (): boolean => {
    const status = get().astronautStatus;
    if (status.health <= 0) {
      get().processNode(DEATH_NODES.health);
      return true;
    }
    if (status.oxygen <= 0) {
      get().processNode(DEATH_NODES.oxygen);
      return true;
    }
    return false;
  },

  processNode: (nodeId: string) => {
    const node = storyNodes[nodeId];
    if (!node) return;

    set({ currentNodeId: nodeId });
    set({ awaitingChoice: false, currentChoices: [] });

    if (node.statusEffect) {
      get().applyStatusEffect(node.statusEffect);
    }

    const processMessages = (index: number) => {
      if (index >= node.messages.length) {
        if (node.isEnding && node.endingType && node.endingTitle && node.endingDescription) {
          set({
            endingData: {
              type: node.endingType,
              title: node.endingTitle,
              description: node.endingDescription,
            },
          });
          get().saveGame();
          return;
        }

        if (node.choices && node.choices.length > 0) {
          const availableChoices = node.choices.filter((choice) => {
            if (!choice.requireStatus) return true;
            const status = get().astronautStatus;
            if (choice.requireStatus.health && status.health < choice.requireStatus.health) return false;
            if (choice.requireStatus.oxygen && status.oxygen < choice.requireStatus.oxygen) return false;
            if (choice.requireStatus.stamina && status.stamina < choice.requireStatus.stamina) return false;
            if (choice.requireStatus.signal && status.signal < choice.requireStatus.signal) return false;
            return true;
          });
          set({ awaitingChoice: true, currentChoices: availableChoices });
          get().saveGame();
          return;
        }

        if (node.nextNodeId) {
          if (get().checkDeath()) return;
          get().processNode(node.nextNodeId);
        }
        return;
      }

      const msg = node.messages[index];
      set({ isTyping: true });
      
      messageTimer = setTimeout(() => {
        set({ isTyping: false });
        get().addMessage({ sender: msg.sender, content: msg.content });
        
        messageTimer = setTimeout(() => {
          processMessages(index + 1);
        }, 800);
      }, msg.delay);
    };

    processMessages(0);
  },

  makeChoice: (choiceId: string) => {
    const { currentChoices, choices } = get();
    const choice = currentChoices.find((c) => c.id === choiceId);
    if (!choice) return;

    get().addMessage({ sender: 'player', content: choice.text });
    set((state) => ({
      choices: [...state.choices, choiceId],
      awaitingChoice: false,
      currentChoices: [],
    }));

    if (choice.statusEffect) {
      get().applyStatusEffect(choice.statusEffect);
    }

    setTimeout(() => {
      if (get().checkDeath()) return;
      get().processNode(choice.nextNodeId);
    }, 1000);
  },
}));
