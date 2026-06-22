export type NoteDirection = 'up' | 'down' | 'left' | 'right';

export type NoteType = 'tap' | 'slide';

export interface Note {
  id: number;
  track: number;
  time: number;
  type: NoteType;
  direction: NoteDirection;
  judged?: boolean;
}

export type SongId = 'twinkle' | 'ode' | 'practice';

export type Difficulty = 1 | 2 | 3;

export interface Song {
  id: SongId;
  title: string;
  subtitle: string;
  artist: string;
  difficulty: Difficulty;
  duration: number;
  bpm: number;
  notes: Note[];
  melody: MelodyNote[];
}

export interface MelodyNote {
  time: number;
  duration: number;
  frequency: number;
}

export type JudgmentType = 'perfect' | 'great' | 'good' | 'miss';

export interface JudgmentResult {
  type: JudgmentType;
  score: number;
  time: number;
  track: number;
  noteId: number;
}

export interface GameState {
  score: number;
  combo: number;
  maxCombo: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  health: number;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  lastJudgment: { type: JudgmentType; track: number } | null;
}

export interface ActiveNote extends Note {
  startTime: number;
  element?: HTMLElement;
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface GameResult {
  song: Song;
  score: number;
  maxCombo: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  grade: Grade;
  accuracy: number;
}

export const TRACK_KEYS = ['d', 'f', 'j', 'k'] as const;
export const TRACK_COUNT = 4;
export const NOTE_FALL_DURATION = 2000;
export const JUDGMENT_LINE_POSITION = 0.85;

export const JUDGMENT_WINDOWS = {
  perfect: 50,
  great: 100,
  good: 150,
} as const;

export const JUDGMENT_SCORES = {
  perfect: 100,
  great: 70,
  good: 30,
  miss: 0,
} as const;

export const TRACK_COLORS = [
  { bg: 'from-pink-400 to-rose-500', glow: 'rgba(244, 114, 182, 0.6)', solid: '#f472b6' },
  { bg: 'from-purple-400 to-violet-500', glow: 'rgba(192, 132, 252, 0.6)', solid: '#c084fc' },
  { bg: 'from-cyan-400 to-sky-500', glow: 'rgba(56, 189, 248, 0.6)', solid: '#38bdf8' },
  { bg: 'from-emerald-400 to-green-500', glow: 'rgba(52, 211, 153, 0.6)', solid: '#34d399' },
] as const;

export const JUDGMENT_COLORS: Record<JudgmentType, string> = {
  perfect: 'text-yellow-400',
  great: 'text-green-400',
  good: 'text-blue-400',
  miss: 'text-gray-400',
};

export const DIRECTION_ARROWS: Record<NoteDirection, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export interface RenderNote extends Note {
  key: string;
  progress: number;
  visible: boolean;
  hitEffect?: boolean;
}

export interface JudgmentPopup {
  id: number;
  type: JudgmentType;
  track: number;
}
