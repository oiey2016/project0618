export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  canUseOn: string[];
  usedToSolve: string[];
  collected: boolean;
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  relatedClues: string[];
  unlocks?: string;
  found: boolean;
}

export interface Puzzle {
  id: string;
  type: 'password' | 'sequence' | 'mechanism';
  answer: string | string[];
  requiredItem?: string;
  reward: {
    type: 'item' | 'clue' | 'scene' | 'ending';
    targetId: string;
  };
  hint: string;
  solved: boolean;
}

export interface Interactable {
  id: string;
  name: string;
  position: { x: number; y: number; width: number; height: number };
  type: 'item' | 'puzzle' | 'clue' | 'exit' | 'info';
  targetId: string;
  requiresItem?: string;
  description: string;
  interactionMessage?: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  bgGradient: string;
  interactables: Interactable[];
  exits: { targetSceneId: string; position: { x: number; y: number; width: number; height: number }; label: string }[];
  unlocked: boolean;
}

export interface ClueConnection {
  from: string;
  to: string;
  result: string;
  unlocks?: {
    type: 'password' | 'clue' | 'hint';
    value: string;
  };
  discovered: boolean;
}

export interface GameState {
  currentScene: string;
  inventory: Item[];
  clues: Clue[];
  puzzles: Puzzle[];
  scenes: Scene[];
  clueConnections: ClueConnection[];
  selectedItem: Item | null;
  dialogMessage: string | null;
  showClueBoard: boolean;
  activePuzzle: Puzzle | null;
  gamePhase: 'start' | 'playing' | 'ending';
  endingType: 'success' | 'fail' | null;
  discoveredPassword: string[];
}

export interface GameStore extends GameState {
  changeScene: (sceneId: string) => void;
  unlockScene: (sceneId: string) => void;
  collectItem: (itemId: string) => void;
  selectItem: (item: Item | null) => void;
  useItem: (itemId: string, targetId: string) => boolean;
  collectClue: (clueId: string) => void;
  connectClues: (clueId1: string, clueId2: string) => boolean;
  startPuzzle: (puzzleId: string) => void;
  closePuzzle: () => void;
  solvePuzzle: (puzzleId: string, answer: string | string[]) => boolean;
  showDialog: (message: string) => void;
  hideDialog: () => void;
  toggleClueBoard: () => void;
  startGame: () => void;
  endGame: (type: 'success' | 'fail') => void;
  resetGame: () => void;
  getHint: () => string;
}
