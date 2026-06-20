import { create } from 'zustand'
import {
  GameStore,
  Critter,
  AttachedCritter,
  CRITTER_COLORS,
  GAME_CONFIG,
  CritterType,
} from '../types/game'
import { SimplexNoise, getTerrainHeight } from '../utils/noise'

const noise = new SimplexNoise(42)

const generateCritters = (count: number): Critter[] => {
  const critters: Critter[] = []
  const worldSize = GAME_CONFIG.WORLD_SIZE

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = 8 + Math.random() * (worldSize * 0.45)
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    const y = getTerrainHeight(x, z, noise) + 0.5

    const typeRoll = Math.random()
    let type: CritterType = 'basic'
    let size = 0.5 + Math.random() * 0.3
    let value = 1

    if (typeRoll > 0.9) {
      type = 'shiny'
      size = 0.4 + Math.random() * 0.2
      value = 3
    } else if (typeRoll > 0.75) {
      type = 'big'
      size = 0.8 + Math.random() * 0.4
      value = 2
    }

    const color = CRITTER_COLORS[Math.floor(Math.random() * CRITTER_COLORS.length)]

    critters.push({
      id: `critter-${i}`,
      position: [x, y, z],
      color,
      size,
      type,
      value,
      isAttached: false,
      rotation: [0, Math.random() * Math.PI * 2, 0],
      hopOffset: Math.random() * Math.PI * 2,
    })
  }

  return critters
}

const calculateDistanceToGoal = (
  ballPos: [number, number, number],
  goalPos: [number, number, number]
): number => {
  return Math.sqrt(
    Math.pow(ballPos[0] - goalPos[0], 2) +
    Math.pow(ballPos[1] - goalPos[1], 2) +
    Math.pow(ballPos[2] - goalPos[2], 2)
  )
}

const initialState = {
  gamePhase: 'menu' as const,
  ballSize: GAME_CONFIG.INITIAL_BALL_SIZE,
  ballPosition: [0, 10, 40] as [number, number, number],
  ballVelocity: [0, 0, 0] as [number, number, number],
  ballRotation: [0, 0, 0] as [number, number, number],
  critters: generateCritters(GAME_CONFIG.CRITTER_COUNT),
  attachedCritters: [] as AttachedCritter[],
  critterCount: 0,
  distanceToGoal: 0,
  progress: 0,
  startTime: 0,
  elapsedTime: 0,
  goalPosition: [0, GAME_CONFIG.MOUNTAIN_HEIGHT + 2, 0] as [number, number, number],
  isJumping: false,
  jumpVelocity: 0,
  lastAttachEffect: 0,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: () => {
    const critters = generateCritters(GAME_CONFIG.CRITTER_COUNT)
    const startPos: [number, number, number] = [0, 10, 40]
    const goalPos: [number, number, number] = [0, GAME_CONFIG.MOUNTAIN_HEIGHT + 2, 0]

    set({
      gamePhase: 'playing',
      ballSize: GAME_CONFIG.INITIAL_BALL_SIZE,
      ballPosition: startPos,
      ballVelocity: [0, 0, 0],
      ballRotation: [0, 0, 0],
      critters,
      attachedCritters: [],
      critterCount: 0,
      distanceToGoal: calculateDistanceToGoal(startPos, goalPos),
      progress: 0,
      startTime: Date.now(),
      elapsedTime: 0,
      goalPosition: goalPos,
      isJumping: false,
      jumpVelocity: 0,
      lastAttachEffect: 0,
    })
  },

  restartGame: () => {
    set({
      gamePhase: 'menu',
    })
  },

  attachCritter: (critterId: string) => {
    const state = get()
    const critter = state.critters.find(c => c.id === critterId)
    
    if (!critter || critter.isAttached) return

    const attachOffset: [number, number, number] = [
      (Math.random() - 0.5) * state.ballSize * 0.8,
      (Math.random() - 0.5) * state.ballSize * 0.8 + state.ballSize * 0.3,
      (Math.random() - 0.5) * state.ballSize * 0.8,
    ]

    const attachedCritter: AttachedCritter = {
      critter,
      attachOffset,
      attachTime: Date.now(),
      originalRotation: [...critter.rotation] as [number, number, number],
    }

    const newSize = Math.min(
      GAME_CONFIG.MAX_BALL_SIZE,
      state.ballSize + critter.value * GAME_CONFIG.BALL_SIZE_PER_CRITTER
    )

    set(state => ({
      critters: state.critters.map(c =>
        c.id === critterId ? { ...c, isAttached: true } : c
      ),
      attachedCritters: [...state.attachedCritters, attachedCritter],
      critterCount: state.critterCount + 1,
      ballSize: newSize,
    }))

    get().triggerAttachEffect()
  },

  updateBallSize: (delta: number) => {
    set(state => ({
      ballSize: Math.max(
        GAME_CONFIG.INITIAL_BALL_SIZE,
        Math.min(GAME_CONFIG.MAX_BALL_SIZE, state.ballSize + delta)
      ),
    }))
  },

  updatePosition: (pos, velocity, rotation) => {
    set(state => {
      const newDistance = calculateDistanceToGoal(pos, state.goalPosition)
      const initialDistance = calculateDistanceToGoal(
        [0, 10, 40],
        state.goalPosition
      )
      const newProgress = Math.max(0, Math.min(100, 
        ((initialDistance - newDistance) / initialDistance) * 100
      ))

      return {
        ballPosition: pos,
        ballVelocity: velocity || state.ballVelocity,
        ballRotation: rotation || state.ballRotation,
        distanceToGoal: newDistance,
        progress: newProgress,
        elapsedTime: Date.now() - state.startTime,
      }
    })
  },

  reachGoal: () => {
    set({
      gamePhase: 'victory',
    })
  },

  setJumping: (jumping, velocity) => {
    set({
      isJumping: jumping,
      jumpVelocity: velocity ?? 0,
    })
  },

  updateProgress: () => {
    const state = get()
    const initialDistance = calculateDistanceToGoal(
      [0, 10, 40],
      state.goalPosition
    )
    const newProgress = Math.max(0, Math.min(100,
      ((initialDistance - state.distanceToGoal) / initialDistance) * 100
    ))
    set({ progress: newProgress })
  },

  triggerAttachEffect: () => {
    set({ lastAttachEffect: Date.now() })
  },
}))
