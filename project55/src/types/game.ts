export interface Player {
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  critRate: number;
  critDamage: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  icon: string;
  level: number;
  maxLevel: number;
  baseStats: {
    attack?: number;
    defense?: number;
    hp?: number;
    critRate?: number;
    critDamage?: number;
  };
  upgradeCost: number;
  upgradeCostMultiplier: number;
}

export interface Monster {
  id: string;
  name: string;
  icon: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  goldDrop: number;
  expDrop: number;
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  type: 'buff' | 'consumable' | 'upgrade';
  effect: {
    stat?: keyof Player;
    value?: number;
    duration?: number;
  };
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface ActiveBuff {
  itemId: string;
  stat: keyof Player;
  value: number;
  endTime: number;
}

export interface DamageNumber {
  id: string;
  value: number;
  isCrit: boolean;
  x: number;
  y: number;
  target: 'player' | 'monster';
}

export interface FloatingText {
  id: string;
  text: string;
  icon?: string;
  x: number;
  y: number;
}

export interface BattleLog {
  id: string;
  message: string;
  type: 'damage' | 'heal' | 'gold' | 'exp' | 'levelup' | 'info';
  timestamp: number;
}

export interface GameState {
  player: Player;
  gold: number;
  gems: number;
  equipment: Equipment[];
  currentStage: number;
  currentMonster: Monster | null;
  isAutoBattle: boolean;
  isPaused: boolean;
  battleSpeed: number;
  inventory: InventoryItem[];
  activeBuffs: ActiveBuff[];
  lastOnlineTime: number;
  totalPlayTime: number;
  monstersKilled: number;
  highestStage: number;
  settings: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    autoSave: boolean;
  };
}

export interface GameActions {
  startBattle: () => void;
  pauseBattle: () => void;
  toggleAutoBattle: () => void;
  setBattleSpeed: (speed: number) => void;
  attack: () => { damage: number; isCrit: boolean };
  takeDamage: (damage: number) => void;
  defeatMonster: () => void;
  spawnMonster: () => void;
  upgradeEquipment: (equipmentId: string) => boolean;
  buyItem: (itemId: string) => boolean;
  useItem: (itemId: string) => boolean;
  addGold: (amount: number) => void;
  addExp: (amount: number) => void;
  levelUp: () => void;
  healPlayer: (amount: number) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
  calculateOfflineRewards: () => { gold: number; exp: number; time: number };
  claimOfflineRewards: () => { gold: number; exp: number };
  updateLastOnlineTime: () => void;
  getPlayerTotalStats: () => Player;
  toggleSound: () => void;
  toggleVibration: () => void;
}

export type GameStore = GameState & GameActions;
