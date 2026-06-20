export type GamePhase = 'menu' | 'countdown' | 'playing' | 'paused' | 'result';

export type Team = 'blue' | 'red';

export type PlayerStatus = 'active' | 'bench';

export interface Player {
  id: string;
  team: Team;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  status: PlayerStatus;
  facingAngle: number;
  hasBall: string | null;
  chargeTime: number;
  isCharging: boolean;
  catchWindow: number;
  flashTime: number;
  rescued: boolean;
  benchOrder: number;
  jumpAnim: number;
  squash: number;
  stretch: number;
}

export interface Ball {
  id: string;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  radius: number;
  ownerTeam: Team | null;
  throwerId: string | null;
  isActive: boolean;
  spin: number;
  heldBy: string | null;
  inAir: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'circle' | 'spark' | 'ring' | 'confetti';
  rotation?: number;
  rotationSpeed?: number;
}

export interface ShockWave {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
  size: number;
}

export interface Scores {
  blue: number;
  red: number;
}

export interface TeamKills {
  blue: number;
  red: number;
}

export interface GameStateShape {
  phase: GamePhase;
  countdown: number;
  countdownFloat: number;
  timeLeft: number;
  players: Player[];
  balls: Ball[];
  particles: Particle[];
  shockWaves: ShockWave[];
  floatingTexts: FloatingText[];
  screenShake: number;
  flashOverlay: number;
  winner: Team | null;
  scores: Scores;
  teamKills: TeamKills;
  ballSpawnTimer: number;
  hintText: string;
  hintTimer: number;
}

export interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  goToMenu: () => void;
  tick: (dt: number) => void;
  playerMove: (team: Team, dir: { x: number; y: number }) => void;
  playerStartCharge: (team: Team) => void;
  playerReleaseCharge: (team: Team) => void;
}

export type GameStore = GameStateShape & { actions: GameActions };
