import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/useGameStore'
import { createClayMaterial, createOutlineMaterial } from '../utils/clayMaterial'
import { AttachedCritter } from '../types/game'

interface ClayBallProps {
  position: [number, number, number]
  rotation: [number, number, number]
  size: number
}

export const ClayBall = ({ position, rotation, size }: ClayBallProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const outlineRef = useRef<THREE.Mesh>(null)
  const attachedGroupRef = useRef<THREE.Group>(null)

  const attachedCritters = useGameStore(state => state.attachedCritters)
  const lastAttachEffect = useGameStore(state => state.lastAttachEffect)

  const clayMaterial = useMemo(() => {
    return createClayMaterial('#E07A5F', 0.9, 0.02)
  }, [])

  const outlineMaterial = useMemo(() => {
    return createOutlineMaterial('#2D2D2D')
  }, [])

  const scalePulse = useRef(1)
  const lastEffectTime = useRef(0)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2])
      meshRef.current.rotation.set(rotation[0], rotation[1], rotation[2])
    }

    if (outlineRef.current) {
      outlineRef.current.position.set(position[0], position[1], position[2])
      outlineRef.current.rotation.set(rotation[0], rotation[1], rotation[2])
    }

    if (attachedGroupRef.current) {
      attachedGroupRef.current.position.set(position[0], position[1], position[2])
      attachedGroupRef.current.rotation.set(rotation[0], rotation[1], rotation[2])
    }

    if (lastAttachEffect > lastEffectTime.current) {
      lastEffectTime.current = lastAttachEffect
      scalePulse.current = 1.15
    }

    scalePulse.current += (1 - scalePulse.current) * delta * 8
    const currentScale = size * scalePulse.current

    if (meshRef.current) {
      meshRef.current.scale.setScalar(currentScale)
    }
    if (outlineRef.current) {
      outlineRef.current.scale.setScalar(currentScale * 1.03)
    }
  })

  return (
    <group>
      <mesh ref={meshRef} material={clayMaterial} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 4]} />
      </mesh>

      <mesh ref={outlineRef} material={outlineMaterial}>
        <icosahedronGeometry args={[1, 4]} />
      </mesh>

      <group ref={attachedGroupRef}>
        {attachedCritters.map((attached: AttachedCritter) => (
          <AttachedCritterMesh
            key={attached.critter.id}
            attached={attached}
            ballSize={size}
          />
        ))}
      </group>
    </group>
  )
}

interface AttachedCritterMeshProps {
  attached: AttachedCritter
  ballSize: number
}

const AttachedCritterMesh = ({ attached, ballSize }: AttachedCritterMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { critter, attachOffset, attachTime } = attached

  const material = useMemo(() => {
    return createClayMaterial(critter.color, 0.85, critter.type === 'shiny' ? 0.3 : 0.05)
  }, [critter.color, critter.type])

  const scaleAnim = useRef(0)
  const startTime = useRef(attachTime)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const elapsed = Date.now() - startTime.current
    const targetScale = critter.size / ballSize

    if (elapsed < 500) {
      const t = elapsed / 500
      scaleAnim.current = targetScale * (1 - Math.cos(t * Math.PI)) / 2
    } else {
      scaleAnim.current = targetScale
    }

    const wobble = Math.sin(Date.now() * 0.005 + critter.hopOffset) * 0.02
    meshRef.current.scale.setScalar(scaleAnim.current + wobble)
  })

  const geometry = critter.type === 'big' 
    ? <icosahedronGeometry args={[1, 2]} />
    : critter.type === 'shiny'
    ? <octahedronGeometry args={[1, 0]} />
    : <dodecahedronGeometry args={[1, 0]} />

  return (
    <mesh
      ref={meshRef}
      position={[
        attachOffset[0] / ballSize,
        attachOffset[1] / ballSize,
        attachOffset[2] / ballSize,
      ]}
      rotation={critter.rotation}
      material={material}
      castShadow
    >
      {geometry}
    </mesh>
  )
}
