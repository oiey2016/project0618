export type NoteType = 'normal' | 'bonus' | 'danger';

export type JudgementType = 'perfect' | 'great' | 'good' | 'miss' | null;

export type GameStatus = 'menu' | 'calibrating' | 'playing' | 'paused' | 'ended';

export interface Note {
  id: string;
  angle: number;
  speed: number;
  spawnTime: number;
  type: NoteType;
  hit: boolean;
  judgement: JudgementType;
  distance: number;
  size: number;
}

export interface HitEffect {
  id: string;
  angle: number;
  type: JudgementType;
  startTime: number;
  duration: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  combo: number;
  maxCombo: number;
  health: number;
  maxHealth: number;
  pointerAngle: number;
  targetPointerAngle: number;
  notes: Note[];
  hitEffects: HitEffect[];
  particles: Particle[];
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  missCount: number;
  startTime: number;
  currentTime: number;
  songDuration: number;
  calibrationOffset: number;
  sensitivity: number;
}

export interface SongData {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  duration: number;
  difficulty: 'easy' | 'normal' | 'hard';
  notes: SongNote[];
}

export interface SongNote {
  time: number;
  angle: number;
  type: NoteType;
}

export interface Settings {
  sensitivity: number;
  musicVolume: number;
  sfxVolume: number;
  highScore: number;
}
