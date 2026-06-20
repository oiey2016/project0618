import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Critter as CritterType } from '../types/game'
import { createClayMaterial } from '../utils/clayMaterial'

interface CritterProps {
  critter: CritterType
}

export const Critter = ({ critter }: CritterProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const eyesRef = useRef<THREE.Group>(null)

  const material = useMemo(() => {
    const metalness = critter.type === 'shiny' ? 0.4 : 0.05
    const roughness = critter.type === 'shiny' ? 0.3 : 0.85
    return createClayMaterial(critter.color, roughness, metalness)
  }, [critter.color, critter.type])

  const basePosition = useRef([...critter.position] as [number, number, number])
  const hopPhase = useRef(critter.hopOffset)
  const wanderAngle = useRef(Math.random() * Math.PI * 2)
  const wanderTimer = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    hopPhase.current += delta * 2
    wanderTimer.current += delta

    if (wanderTimer.current > 2) {
      wanderTimer.current = 0
      wanderAngle.current += (Math.random() - 0.5) * Math.PI * 0.5
    }

    const wanderSpeed = 0.5
    const wanderX = Math.cos(wanderAngle.current) * wanderSpeed * delta
    const wanderZ = Math.sin(wanderAngle.current) * wanderSpeed * delta

    basePosition.current[0] += wanderX
    basePosition.current[2] += wanderZ

    const worldSize = 45
    basePosition.current[0] = Math.max(-worldSize, Math.min(worldSize, basePosition.current[0]))
    basePosition.current[2] = Math.max(-worldSize, Math.min(worldSize, basePosition.current[2]))

    const hopHeight = critter.type === 'big' ? 0.3 : 0.2
    const hopY = Math.abs(Math.sin(hopPhase.current)) * hopHeight

    meshRef.current.position.set(
      basePosition.current[0],
      basePosition.current[1] + hopY,
      basePosition.current[2]
    )

    const squash = 1 - Math.abs(Math.sin(hopPhase.current)) * 0.15
    const stretch = 1 + Math.abs(Math.sin(hopPhase.current)) * 0.1
    meshRef.current.scale.set(critter.size * squash, critter.size * stretch, critter.size * squash)

    meshRef.current.rotation.y += delta * 0.5

    if (eyesRef.current) {
      eyesRef.current.rotation.y = -meshRef.current.rotation.y
    }

    critter.position[0] = basePosition.current[0]
    critter.position[1] = basePosition.current[1] + hopY
    critter.position[2] = basePosition.current[2]
  })

  const geometry = critter.type === 'big' 
    ? <icosahedronGeometry args={[1, 1]} />
    : critter.type === 'shiny'
    ? <octahedronGeometry args={[1, 0]} />
    : <dodecahedronGeometry args={[1, 0]} />

  const eyeScale = critter.type === 'big' ? 0.15 : critter.type === 'shiny' ? 0.08 : 0.1

  return (
    <mesh
      ref={meshRef}
      material={material}
      castShadow
      receiveShadow
    >
      {geometry}
      <group ref={eyesRef}>
        <mesh position={[-0.25, 0.2, 0.8]}>
          <sphereGeometry args={[eyeScale, 8, 8]} />
          <meshBasicMaterial color="#2D2D2D" />
        </mesh>
        <mesh position={[0.25, 0.2, 0.8]}>
          <sphereGeometry args={[eyeScale, 8, 8]} />
          <meshBasicMaterial color="#2D2D2D" />
        </mesh>
        <mesh position={[-0.25, 0.22, 0.88]}>
          <sphereGeometry args={[eyeScale * 0.4, 4, 4]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.25, 0.22, 0.88]}>
          <sphereGeometry args={[eyeScale * 0.4, 4, 4]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </mesh>
  )
}

interface CritterManagerProps {
  critters: CritterType[]
}

export const CritterManager = ({ critters }: CritterManagerProps) => {
  return (
    <group>
      {critters
        .filter(c => !c.isAttached)
        .map(critter => (
          <Critter key={critter.id} critter={critter} />
        ))}
    </group>
  )
}
