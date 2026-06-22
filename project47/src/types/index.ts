export type ScenePhase = 'dawn' | 'noon' | 'dusk' | 'night';

export type JudgeType = 'perfect' | 'great' | 'good' | 'miss';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'ended';

export type Difficulty = 1 | 2 | 3;

export type Rank = 'S' | 'A' | 'B' | 'C' | null;

export interface Note {
  id: number;
  key: number;
  time: number;
  duration?: number;
}

export interface StorySegment {
  id: number;
  time: number;
  text: string;
  duration: number;
}

export interface Song {
  id: string;
  title: string;
  subtitle: string;
  composer: string;
  storyTitle: string;
  difficulty: Difficulty;
  bpm: number;
  duration: number;
  notes: Note[];
  storySegments: StorySegment[];
  sceneColors: {
    dawn: [string, string, string, string];
    noon: [string, string, string, string];
    dusk: [string, string, string, string];
    night: [string, string, string, string];
  };
}

export interface ActiveNote extends Note {
  y: number;
  hit: boolean;
  missed: boolean;
  particlePhase: number;
  judgeType?: JudgeType;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'hit' | 'ambient' | 'star' | 'petal';
  rotation?: number;
  rotationSpeed?: number;
}

export interface JudgeDisplay {
  id: number;
  type: JudgeType;
  x: number;
  y: number;
  createdAt: number;
}

export interface GameState {
  status: GameStatus;
  currentTime: number;
  countdown: number;
  score: number;
  combo: number;
  maxCombo: number;
  judges: Record<JudgeType, number>;
  activeNotes: ActiveNote[];
  pressedKeys: Set<number>;
  scenePhase: ScenePhase;
  sceneBlend: number;
  particles: Particle[];
  judgeDisplays: JudgeDisplay[];
  currentStory: StorySegment | null;
  storyAlpha: number;
  songId: string | null;
  noteSpeed: number;
}

export interface SongProgress {
  unlocked: boolean;
  bestScore: number;
  bestRank: Rank;
  completed: boolean;
  playCount: number;
}

export interface SaveData {
  version: string;
  songs: Record<string, SongProgress>;
  settings: {
    volume: number;
    noteSpeed: number;
  };
  totalPlayTime: number;
}

export interface JudgeResult {
  type: JudgeType;
  score: number;
}

export const JUDGE_WINDOWS: Record<Exclude<JudgeType, 'miss'>, number> = {
  perfect: 50,
  great: 100,
  good: 150,
};

export const JUDGE_SCORES: Record<JudgeType, number> = {
  perfect: 100,
  great: 70,
  good: 40,
  miss: 0,
};

export const JUDGE_COLORS: Record<JudgeType, string> = {
  perfect: '#FFD700',
  great: '#FFB347',
  good: '#8B9DC3',
  miss: '#E74C3C',
};

export const KEY_COUNT = 6;

export const FALL_DURATION = 2000;

export const PIANO_KEY_NOTES = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4',
];

export const PIANO_FREQUENCIES: Record<string, number> = {
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'C5': 523.25,
  'B4': 493.88,
};
