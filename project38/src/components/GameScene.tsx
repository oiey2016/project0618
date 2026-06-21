import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'
import { generateTrackPoints } from '../utils/levels'
import type { TrackSegment } from '../utils/levels'

interface GameSceneProps {
  segments: TrackSegment[]
  startPosition: [number, number, number]
  endPosition: [number, number, number]
  ballPosition: [number, number, number]
  onBallMove: (position: [number, number, number]) => void
  onGameOver: () => void
  onSuccess: () => void
}

export function GameScene({ segments, startPosition, endPosition, ballPosition, onBallMove, onGameOver, onSuccess }: GameSceneProps) {
  const ballRef = useRef<THREE.Mesh>(null)
  const trackRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const trackPoints = useMemo(() => generateTrackPoints(segments), [segments])

  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.position.set(ballPosition[0], ballPosition[1], ballPosition[2])
    }
  }, [ballPosition])

  useFrame(() => {
    if (!ballRef.current) return

    const ball = ballRef.current
    const pos = ball.position

    if (pos.y < -10) {
      onGameOver()
      return
    }

    const end = new THREE.Vector3(endPosition[0], endPosition[1], endPosition[2])
    const distanceToEnd = pos.distanceTo(end)
    
    if (distanceToEnd < 2) {
      onSuccess()
      return
    }

    onBallMove([pos.x, pos.y, pos.z])

    const cameraOffset = new THREE.Vector3(8, 8, 8)
    const targetPos = new THREE.Vector3(pos.x, pos.y + 1, pos.z)
    camera.position.lerp(targetPos.clone().add(cameraOffset), 0.05)
    camera.lookAt(targetPos)
  })

  const curve = useMemo(() => {
    const curvePoints = trackPoints.map(p => new THREE.Vector3(p[0], p[1], p[2]))
    return new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5)
  }, [trackPoints])

  const trackGeometry = useMemo(() => {
    const extrudeSettings = {
      steps: 100,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5,
    }

    const shape = new THREE.Shape()
    const trackWidth = 1
    shape.moveTo(-trackWidth / 2, 0)
    shape.lineTo(trackWidth / 2, 0)
    shape.lineTo(trackWidth / 2, 0.1)
    shape.lineTo(-trackWidth / 2, 0.1)
    shape.lineTo(-trackWidth / 2, 0)

    const geometry = new THREE.ExtrudeGeometry(shape, {
      ...extrudeSettings,
      curveSegments: 50,
      extrudePath: curve,
    })
    return geometry
  }, [curve])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 20, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4fc3f7" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
        <mesh ref={trackRef} geometry={trackGeometry}>
          <meshStandardMaterial 
            color="#78909c" 
            roughness={0.3} 
            metalness={0.7}
            emissive="#37474f"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      <mesh ref={ballRef} position={startPosition}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#ff5722" 
          roughness={0.2} 
          metalness={0.8}
          emissive="#bf360c"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={endPosition}>
        <cylinderGeometry args={[0.6, 0.8, 0.2, 32]} />
        <meshStandardMaterial 
          color="#4caf50" 
          roughness={0.2} 
          metalness={0.8}
          emissive="#2e7d32"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enabled={false}
      />
    </>
  )
}
