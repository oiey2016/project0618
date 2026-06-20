export type GamePhase = 'menu' | 'playing' | 'victory'

export type CritterType = 'basic' | 'big' | 'shiny'

export interface Critter {
  id: string
  position: [number, number, number]
  color: string
  size: number
  type: CritterType
  value: number
  isAttached: boolean
  rotation: [number, number, number]
  hopOffset: number
}

export interface AttachedCritter {
  critter: Critter
  attachOffset: [number, number, number]
  attachTime: number
  originalRotation: [number, number, number]
}

export interface GameState {
  gamePhase: GamePhase
  ballSize: number
  ballPosition: [number, number, number]
  ballVelocity: [number, number, number]
  ballRotation: [number, number, number]
  critters: Critter[]
  attachedCritters: AttachedCritter[]
  critterCount: number
  distanceToGoal: number
  progress: number
  startTime: number
  elapsedTime: number
  goalPosition: [number, number, number]
  isJumping: boolean
  jumpVelocity: number
  lastAttachEffect: number
}

export interface GameActions {
  startGame: () => void
  restartGame: () => void
  attachCritter: (critterId: string) => void
  updateBallSize: (delta: number) => void
  updatePosition: (pos: [number, number, number], velocity?: [number, number, number], rotation?: [number, number, number]) => void
  reachGoal: () => void
  setJumping: (jumping: boolean, velocity?: number) => void
  updateProgress: () => void
  triggerAttachEffect: () => void
}

export type GameStore = GameState & GameActions

export const CRITTER_COLORS = [
  '#E07A5F',
  '#81B29A',
  '#F2CC8F',
  '#E8C2CA',
  '#A8DADC',
  '#B5EAD7',
  '#FFDAC1',
  '#C7CEEA',
]

export const GAME_CONFIG = {
  INITIAL_BALL_SIZE: 1,
  MAX_BALL_SIZE: 5,
  BALL_SIZE_PER_CRITTER: 0.15,
  MOVE_SPEED: 36,
  JUMP_FORCE: 40,
  GRAVITY: 45,
  FRICTION: 0.92,
  GOAL_RADIUS: 3,
  CRITTER_COUNT: 40,
  WORLD_SIZE: 100,
  MOUNTAIN_HEIGHT: 25,
  ATTACH_DISTANCE: 1.5,
} as const
