export interface Scene {
  id: string;
  name: string;
  description: string;
  backgroundClass: string;
  hotspots: Hotspot[];
  exits: Exit[];
}

export interface Exit {
  direction: 'left' | 'right' | 'up' | 'down';
  targetScene: string;
  label?: string;
  condition?: string;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'item' | 'puzzle' | 'npc' | 'inspect' | 'exit';
  targetId: string;
  condition?: string;
  hint?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  combinable?: { with: string; result: string }[];
  usableOn?: string[];
}

export interface Puzzle {
  id: string;
  type: 'password' | 'combination' | 'item_use' | 'sequence';
  name: string;
  description: string;
  solution: string | string[];
  reward: string;
  hint?: string;
  requiredItem?: string;
}

export interface Guest {
  id: string;
  name: string;
  roomId: string;
  description: string;
  portrait: string;
  dialogue: string[];
  servedDialogue: string[];
  requiredDish: string;
  served: boolean;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  icon: string;
}

export interface GameState {
  currentScene: string;
  inventory: string[];
  selectedItem: string | null;
  solvedPuzzles: string[];
  collectedItems: string[];
  servedGuests: string[];
  currentDialogue: string | null;
  dialogueSpeaker: string | null;
  showingPuzzle: string | null;
  showingGuide: boolean;
  gamePhase: 'start' | 'playing' | 'ending';
  hintsRemaining: number;
  sceneTransitioning: boolean;
  flags: Record<string, boolean>;

  changeScene: (sceneId: string) => void;
  collectItem: (itemId: string) => void;
  selectItem: (itemId: string | null) => void;
  useItem: (itemId: string, targetId: string) => boolean;
  combineItems: (item1: string, item2: string) => boolean;
  solvePuzzle: (puzzleId: string) => void;
  openPuzzle: (puzzleId: string) => void;
  closePuzzle: () => void;
  openGuide: () => void;
  closeGuide: () => void;
  serveDish: (guestId: string) => void;
  showDialogue: (text: string, speaker?: string) => void;
  closeDialogue: () => void;
  startGame: () => void;
  resetGame: () => void;
  useHint: () => string | null;
  setFlag: (key: string, value: boolean) => void;
  getFlag: (key: string) => boolean;
}
