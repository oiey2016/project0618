export interface EraTheme {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  gradient: string;
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  cost: number;
  eraId: string;
  built: boolean;
  svgIcon: string;
}

export interface Era {
  id: string;
  name: string;
  emoji: string;
  description: string;
  year: string;
  theme: EraTheme;
  landmarks: Landmark[];
  unlocked: boolean;
}

export interface Quiz {
  id: string;
  eraId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GameState {
  knowledgePoints: number;
  currentEraId: string;
  eras: Era[];
  quizzes: Quiz[];
  answeredQuizIds: string[];
  totalAnswered: number;
  totalCorrect: number;
  gameCompleted: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

export type QuizResult = {
  correct: boolean;
  explanation: string;
  correctAnswer: string;
  pointsEarned: number;
};
