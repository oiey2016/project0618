export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type CatState = 'walking' | 'eating' | 'leaving' | 'waiting';

export type DecorationCategory = 'furniture' | 'plant' | 'toy' | 'wall';

export interface Dish {
  id: string;
  name: string;
  description: string;
  emoji: string;
  basePrice: number;
  unlockCost: number;
  unlockTime: number;
  attractsCats: string[];
  rarity: Exclude<Rarity, 'legendary'>;
}

export interface Cat {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: Rarity;
  favoriteDishes: string[];
  coinReward: number;
  personality: string;
  stayDuration: number;
}

export interface Decoration {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  reputationBonus: number;
  category: DecorationCategory;
}

export interface ActiveCat {
  id: string;
  catId: string;
  orderedDish: string | null;
  positionX: number;
  positionY: number;
  targetX: number;
  targetY: number;
  state: CatState;
  coinReady: boolean;
  coinAmount: number;
  stateTimer: number;
  seatIndex: number | null;
}

export interface PlacedDecoration {
  id: string;
  decorationId: string;
  positionX: number;
  positionY: number;
}

export interface ResearchingDish {
  dishId: string;
  startTime: number;
  duration: number;
}

export interface GameState {
  coins: number;
  level: number;
  reputation: number;
  experience: number;
  experienceToNextLevel: number;
  
  unlockedDishes: string[];
  dishLevels: Record<string, number>;
  researchingDish: ResearchingDish | null;
  
  unlockedCats: string[];
  catVisitCounts: Record<string, number>;
  totalCatsServed: number;
  
  ownedDecorations: string[];
  placedDecorations: PlacedDecoration[];
  
  activeCats: ActiveCat[];
  maxActiveCats: number;
  
  lastSaveTime: number;
  lastSpawnTime: number;
  
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addExperience: (amount: number) => void;
  addReputation: (amount: number) => void;
  
  unlockDish: (dishId: string) => boolean;
  startResearch: (dishId: string) => boolean;
  completeResearch: () => void;
  
  unlockCat: (catId: string) => void;
  incrementCatVisit: (catId: string) => void;
  
  buyDecoration: (decorationId: string) => boolean;
  placeDecoration: (decorationId: string, x: number, y: number) => void;
  removeDecoration: (placedId: string) => void;
  
  spawnCat: (catId: string) => void;
  collectCoin: (activeCatId: string) => void;
  updateCats: (deltaTime: number) => void;
  
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
}
