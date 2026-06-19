export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  usableIn?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'zero' | 'player' | 'system';
  type: 'text' | 'voice' | 'image' | 'clue';
  content: string;
  timestamp: number;
  voiceDuration?: number;
  imageUrl?: string;
}

export interface StateEffects {
  health?: number;
  hunger?: number;
  trust?: number;
}

export interface MessageNode {
  id: string;
  type: 'message';
  messages: Omit<ChatMessage, 'id' | 'timestamp'>[];
  nextNodeId?: string;
  effects?: StateEffects;
  giveItem?: Item;
  delay?: number;
}

export interface ChoiceOption {
  id: string;
  text: string;
  nextNodeId: string;
  effects?: StateEffects;
  requiredItem?: string;
  playerResponse?: string;
}

export interface ChoiceNode {
  id: string;
  type: 'choice';
  prompt: string;
  choices: ChoiceOption[];
}

export interface EndingNode {
  id: string;
  type: 'ending';
  endingType: 'good' | 'bad' | 'neutral' | 'death';
  title: string;
  description: string;
}

export type StoryNode = MessageNode | ChoiceNode | EndingNode;

export interface GameState {
  health: number;
  hunger: number;
  trust: number;
  inventory: Item[];
  currentNodeId: string;
  messageHistory: ChatMessage[];
  isGameOver: boolean;
  endingType?: string;
  endingTitle?: string;
  endingDescription?: string;
  flags: Record<string, boolean>;
  awaitingChoice: boolean;
  typing: boolean;
}

export interface GameActions {
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  applyEffects: (effects: StateEffects) => void;
  addItem: (item: Item) => void;
  setCurrentNode: (nodeId: string) => void;
  setAwaitingChoice: (v: boolean) => void;
  setTyping: (v: boolean) => void;
  triggerEnding: (type: string, title: string, description: string) => void;
  setFlag: (key: string, value: boolean) => void;
  resetGame: () => void;
  checkDeath: () => void;
}
