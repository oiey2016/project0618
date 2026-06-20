import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SimplexNoise } from '../utils/noise'
import { useControls } from '../hooks/useControls'
import { usePhysics } from '../hooks/usePhysics'
import { useGameStore } from '../store/useGameStore'
import { ClayBall } from './ClayBall'
import { CritterManager } from './Critter'
import { Terrain, GroundDecorations } from './Terrain'
import { Goal, VictoryParticles } from './Goal'
import { GAME_CONFIG } from '../types/game'

const noise = new SimplexNoise(42)

interface GameSceneContentProps {
  onGoalReached?: () => void
}

const GameSceneContent = ({ onGoalReached }: GameSceneContentProps) => {
  const { getMovementVector, consumeJump } = useControls()
  const { resetPhysics, updatePhysics, checkCritterCollision, checkGoalCollision } = usePhysics(noise)
  const { camera } = useThree()

  const gamePhase = useGameStore(state => state.gamePhase)
  const ballPosition = useGameStore(state => state.ballPosition)
  const ballRotation = useGameStore(state => state.ballRotation)
  const ballSize = useGameStore(state => state.ballSize)
  const critters = useGameStore(state => state.critters)
  const goalPosition = useGameStore(state => state.goalPosition)
  const updatePosition = useGameStore(state => state.updatePosition)
  const attachCritter = useGameStore(state => state.attachCritter)
  const reachGoal = useGameStore(state => state.reachGoal)
  const startGame = useGameStore(state => state.startGame)

  const cameraTargetRef = useRef(new THREE.Vector3())
  const cameraPositionRef = useRef(new THREE.Vector3())
  const isVictoryRef = useRef(false)

  useEffect(() => {
    if (gamePhase === 'playing') {
      resetPhysics(ballPosition)
      isVictoryRef.current = false
    }
  }, [gamePhase, ballPosition, resetPhysics])

  useFrame((state, delta) => {
    if (gamePhase !== 'playing') return

    const moveInput = getMovementVector()
    const jumpPressed = consumeJump()

    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)

    const physicsResult = updatePhysics(
      delta,
      moveInput,
      jumpPressed,
      ballSize,
      cameraDirection
    )

    updatePosition(
      physicsResult.position,
      physicsResult.velocity,
      physicsResult.rotation
    )

    critters.forEach(critter => {
      if (!critter.isAttached) {
        const collision = checkCritterCollision(
          physicsResult.position,
          ballSize,
          critter.position,
          critter.size
        )
        if (collision) {
          attachCritter(critter.id)
        }
      }
    })

    const goalCollision = checkGoalCollision(
      physicsResult.position,
      ballSize,
      goalPosition
    )
    if (goalCollision && !isVictoryRef.current) {
      isVictoryRef.current = true
      reachGoal()
      onGoalReached?.()
    }

    const ballPos = new THREE.Vector3(
      physicsResult.position[0],
      physicsResult.position[1],
      physicsResult.position[2]
    )

    const cameraOffset = new THREE.Vector3(0, 6 + ballSize * 0.5, 12 + ballSize * 1.5)
    const targetPosition = new THREE.Vector3().copy(ballPos).add(cameraOffset)

    cameraPositionRef.current.lerp(targetPosition, delta * 3)
    camera.position.copy(cameraPositionRef.current)

    cameraTargetRef.current.lerp(ballPos, delta * 5)
    camera.lookAt(cameraTargetRef.current)
  })

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.5}
        azimuth={0.25}
      />

      <ambientLight intensity={0.6} color="#FFF5E6" />
      <directionalLight
        position={[30, 50, 30]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight
        position={[-20, 30, -20]}
        intensity={0.4}
        color="#FFDAC1"
      />

      <fog attach="fog" args={['#F4F1DE', 40, 100]} />

      <Terrain noise={noise} />
      <GroundDecorations noise={noise} />

      <CritterManager critters={critters} />

      <Goal
        position={goalPosition}
        isReached={gamePhase === 'victory'}
      />

      <VictoryParticles active={gamePhase === 'victory'} />

      {gamePhase === 'playing' && (
        <ClayBall
          position={ballPosition}
          rotation={ballRotation}
          size={ballSize}
        />
      )}

      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

interface GameSceneProps {
  className?: string
}

export const GameScene = ({ className }: GameSceneProps) => {
  const startGame = useGameStore(state => state.startGame)
  const gamePhase = useGameStore(state => state.gamePhase)

  return (
    <Canvas
      className={className}
      shadows
      camera={{ position: [0, 15, 50], fov: 60, near: 0.1, far: 1000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#F4F1DE']} />
      <GameSceneContent />
    </Canvas>
  )
}
