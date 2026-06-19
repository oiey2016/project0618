export type PlanetType = 'start' | 'hub' | 'waypoint' | 'end';

export interface Planet {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  type: PlanetType;
  faction: string;
}

export type RiskLevel = 'low' | 'mid' | 'high';

export interface Route {
  id: string;
  fromId: string;
  toId: string;
  travelDays: number;
  fuelCost: number;
  stardustCost: number;
  riskLevel: RiskLevel;
}

export type ItemCategory = 'consumable' | 'equipment' | 'special';
export type ItemRarity = 'common' | 'rare' | 'legendary';

export interface ItemEffect {
  stardust?: number;
  fuel?: number;
  morale?: number;
  days?: number;
  special?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: ItemRarity;
  category: ItemCategory;
  effect: ItemEffect;
  consumable: boolean;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface EventOption {
  id: string;
  text: string;
  resultText: string;
  effect: ItemEffect;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  triggerCondition?: RiskLevel;
  options: EventOption[];
}

export type LogType = 'narrative' | 'event' | 'route' | 'item' | 'system';

export interface LogEntry {
  day: number;
  type: LogType;
  content: string;
  timestamp: number;
}

export interface GameStats {
  totalDaysUsed: number;
  planetsVisited: number;
  eventsResolved: number;
  stardustEarned: number;
  stardustSpent: number;
  itemsUsed: number;
}

export type Screen = 'start' | 'game' | 'end';

export interface GameState {
  screen: Screen;
  daysRemaining: number;
  currentDay: number;
  stardust: number;
  fuel: number;
  morale: number;
  currentPlanetId: string;
  visitedPlanetIds: string[];
  inventory: InventoryItem[];
  storyLog: LogEntry[];
  activeEvent: GameEvent | null;
  selectedRouteId: string | null;
  stats: GameStats;
  isGameOver: boolean;
  isVictory: boolean;
  endReason?: string;
  availableRoutes: Route[];
  currentPlanet: Planet | undefined;
  inventoryFull: boolean;
}

export interface GameStoreActions {
  startNewGame(): void;
  restartGame(): void;
  loadGame(): boolean;
  saveGame(): void;
  selectRoute(routeId: string): void;
  switchScreen(screen: Screen): void;
  travel(): void;
  triggerRandomEvent(riskLevel?: RiskLevel): void;
  resolveEventOption(optionIndex: number): void;
  useItem(itemId: string): void;
  discardItem(itemId: string): void;
  returnToTitle(): void;
}

export type GameStore = GameState & GameStoreActions;
