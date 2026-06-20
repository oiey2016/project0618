export type EquipmentType = 'weapon' | 'armor' | 'accessory';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: Rarity;
  price: number;
  description: string;
  emoji: string;
  stats: {
    attack?: number;
    defense?: number;
    luck?: number;
  };
}

export interface PlayerData {
  name: string;
  level: number;
  exp: number;
  gold: number;
  attack: number;
  defense: number;
  luck: number;
  equipment: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };
  inventory: string[];
  unlockedLevels: string[];
  completedLevels: string[];
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: number;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  emoji: string;
  questionIds: string[];
  rewardGold: number;
  rewardExp: number;
  position: { x: number; y: number };
  requiredLevel?: number;
}

export interface QuizState {
  currentLevelId: string | null;
  currentQuestionIndex: number;
  correctCount: number;
  totalQuestions: number;
  isAnswering: boolean;
  selectedAnswer: number | null;
  showExplanation: boolean;
  earnedGold: number;
}

export type PageType = 'menu' | 'map' | 'quiz' | 'shop' | 'inventory' | 'result';

export interface RarityConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}
