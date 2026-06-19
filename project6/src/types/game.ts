export interface AstronautStatus {
  health: number;
  oxygen: number;
  stamina: number;
  signal: number;
}

export interface Message {
  id: string;
  sender: 'astronaut' | 'player' | 'system';
  content: string;
  timestamp: number;
}

export interface StoryMessage {
  sender: 'astronaut' | 'system';
  content: string;
  delay: number;
}

export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
  statusEffect?: Partial<AstronautStatus>;
  requireStatus?: Partial<AstronautStatus>;
}

export interface StoryNode {
  id: string;
  messages: StoryMessage[];
  choices?: StoryChoice[];
  statusEffect?: Partial<AstronautStatus>;
  nextNodeId?: string;
  isEnding?: boolean;
  endingType?: 'survive' | 'death' | 'rescue' | 'sacrifice';
  endingTitle?: string;
  endingDescription?: string;
}

export interface GameState {
  isStarted: boolean;
  currentNodeId: string;
  messages: Message[];
  astronautStatus: AstronautStatus;
  choices: string[];
  startTime: number;
  isTyping: boolean;
  awaitingChoice: boolean;
  currentChoices: StoryChoice[];
  endingData?: {
    type: 'survive' | 'death' | 'rescue' | 'sacrifice';
    title: string;
    description: string;
  };
}

export interface GameStore extends GameState {
  startNewGame: () => void;
  loadGame: () => boolean;
  saveGame: () => void;
  processNode: (nodeId: string) => void;
  makeChoice: (choiceId: string) => void;
  setTyping: (typing: boolean) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  applyStatusEffect: (effect: Partial<AstronautStatus>) => void;
  checkDeath: () => boolean;
  resetGame: () => void;
}

export const INITIAL_STATUS: AstronautStatus = {
  health: 85,
  oxygen: 72,
  stamina: 65,
  signal: 58,
};
