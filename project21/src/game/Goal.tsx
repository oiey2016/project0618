import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GAME_CONFIG } from '../types/game'
import { createClayMaterial } from '../utils/clayMaterial'

interface GoalProps {
  position: [number, number, number]
  isReached: boolean
}

export const Goal = ({ position, isReached }: GoalProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const targetRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const targetMaterial = useMemo(() => {
    return createClayMaterial('#FFE66D', 0.3, 0.8)
  }, [])

  const particleCount = 50
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 2 + Math.random() * 2
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [])

  const particleColors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3)
    const colorPalette = [
      new THREE.Color('#FFE66D'),
      new THREE.Color('#FFB347'),
      new THREE.Color('#FFDAC1'),
      new THREE.Color('#F2CC8F'),
    ]
    for (let i = 0; i < particleCount; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return colors
  }, [])

  const pulsePhase = useRef(0)
  const floatPhase = useRef(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2])
    }

    pulsePhase.current += delta * 2
    floatPhase.current += delta * 1.5

    const pulseScale = 1 + Math.sin(pulsePhase.current) * 0.15
    const floatOffset = Math.sin(floatPhase.current) * 0.5

    if (targetRef.current) {
      targetRef.current.scale.setScalar(pulseScale * (isReached ? 0 : 1))
      targetRef.current.position.y = floatOffset
      targetRef.current.rotation.y += delta * 0.5
    }

    if (glowRef.current) {
      const glowScale = pulseScale * 1.5
      glowRef.current.scale.setScalar(glowScale * (isReached ? 0 : 1))
      glowRef.current.position.y = floatOffset
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial
      glowMat.opacity = 0.3 + Math.sin(pulsePhase.current) * 0.1
    }

    if (particlesRef.current && !isReached) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        const speed = 0.5 + (i % 5) * 0.1
        const angle = pulsePhase.current * speed + i
        positions[idx + 1] += Math.sin(angle) * delta * 0.5
        if (positions[idx + 1] > 4) positions[idx + 1] = -2
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.rotation.y += delta * 0.2
    }

    if (isReached && groupRef.current) {
      groupRef.current.scale.x += (0 - groupRef.current.scale.x) * delta * 3
      groupRef.current.scale.y += (0 - groupRef.current.scale.y) * delta * 3
      groupRef.current.scale.z += (0 - groupRef.current.scale.z) * delta * 3
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[GAME_CONFIG.GOAL_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#FFE66D"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh
        ref={targetRef}
        material={targetMaterial}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[GAME_CONFIG.GOAL_RADIUS * 0.6, 1]} />
      </mesh>

      <mesh position={[-0.3, GAME_CONFIG.GOAL_RADIUS * 0.3, GAME_CONFIG.GOAL_RADIUS * 0.4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#2D2D2D" />
      </mesh>
      <mesh position={[0.3, GAME_CONFIG.GOAL_RADIUS * 0.3, GAME_CONFIG.GOAL_RADIUS * 0.4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#2D2D2D" />
      </mesh>
      <mesh position={[-0.25, GAME_CONFIG.GOAL_RADIUS * 0.35, GAME_CONFIG.GOAL_RADIUS * 0.5]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.35, GAME_CONFIG.GOAL_RADIUS * 0.35, GAME_CONFIG.GOAL_RADIUS * 0.5]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      <mesh position={[0, 0, GAME_CONFIG.GOAL_RADIUS * 0.55]}>
        <torusGeometry args={[0.2, 0.05, 8, 16, Math.PI]} />
        <meshBasicMaterial color="#E07A5F" />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particleColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export const VictoryParticles = ({ active }: { active: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 200

  const { positions, colors, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    const vel = new Float32Array(particleCount * 3)

    const colorPalette = [
      '#E07A5F', '#81B29A', '#F2CC8F', '#F4F1DE',
      '#FFE66D', '#FFB347', '#C7CEEA', '#B5EAD7',
    ]

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pos[i * 3] = 0
      pos[i * 3 + 1] = GAME_CONFIG.MOUNTAIN_HEIGHT + 5
      pos[i * 3 + 2] = 0

      const speed = 5 + Math.random() * 10
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
      vel[i * 3 + 1] = Math.cos(phi) * speed + 5
      vel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed

      const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)])
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }

    return { positions: pos, colors: col, velocities: vel }
  }, [])

  const startTime = useRef(0)
  const activeRef = useRef(false)

  useFrame((_, delta) => {
    if (active && !activeRef.current) {
      activeRef.current = true
      startTime.current = Date.now()
    }

    if (!active || !pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const elapsed = (Date.now() - startTime.current) / 1000

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3
      velocities[idx + 1] -= 15 * delta
      positions[idx] += velocities[idx] * delta
      positions[idx + 1] += velocities[idx + 1] * delta
      positions[idx + 2] += velocities[idx + 2] * delta
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = Math.max(0, 1 - elapsed / 10)
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
      />
    </points>
  )
}
