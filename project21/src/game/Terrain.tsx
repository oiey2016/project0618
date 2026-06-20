import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SimplexNoise, getTerrainHeight } from '../utils/noise'
import { createClayMaterial } from '../utils/clayMaterial'
import { GAME_CONFIG } from '../types/game'

interface TerrainProps {
  noise: SimplexNoise
}

export const Terrain = ({ noise }: TerrainProps) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const { geometry, material } = useMemo(() => {
    const size = GAME_CONFIG.WORLD_SIZE
    const segments = 128

    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    geo.rotateX(-Math.PI / 2)

    const positions = geo.attributes.position
    const colors = new Float32Array(positions.count * 3)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      const y = getTerrainHeight(x, z, noise, [0, 0], GAME_CONFIG.MOUNTAIN_HEIGHT, size)
      
      positions.setY(i, y)

      const heightFactor = Math.min(1, y / (GAME_CONFIG.MOUNTAIN_HEIGHT + 5))
      const distToCenter = Math.sqrt(x * x + z * z)
      const centerFactor = Math.max(0, 1 - distToCenter / (size * 0.3))

      let color = new THREE.Color()
      if (heightFactor < 0.2) {
        color.setHex(0x81B29A)
      } else if (heightFactor < 0.5) {
        color.setHex(0xF2CC8F)
      } else if (heightFactor < 0.8) {
        color.setHex(0xE07A5F)
      } else {
        color.setHex(0xF4F1DE)
      }

      if (centerFactor > 0.5) {
        const mountainColor = new THREE.Color(0xE07A5F)
        color.lerp(mountainColor, centerFactor * 0.5)
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    const mat = createClayMaterial('#E07A5F', 0.95, 0)
    mat.vertexColors = true

    return { geometry: geo, material: mat }
  }, [noise])

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} receiveShadow>
    </mesh>
  )
}

export const GroundDecorations = ({ noise }: TerrainProps) => {
  const decorationsRef = useRef<THREE.Group>(null)

  const decorations = useMemo(() => {
    const items: {
      position: [number, number, number]
      type: 'rock' | 'mushroom' | 'flower'
      color: string
      scale: number
      rotation: [number, number, number]
    }[] = []

    const rockColors = ['#6B705C', '#A5A58D', '#B7B7A4']
    const mushroomColors = ['#E63946', '#F4A261', '#2A9D8F']
    const flowerColors = ['#FFB5A7', '#FCD5CE', '#D8E2DC']

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 5 + Math.random() * 45
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const y = getTerrainHeight(x, z, noise)

      const typeRoll = Math.random()
      let type: 'rock' | 'mushroom' | 'flower'
      let color: string
      let scale: number

      if (typeRoll > 0.7) {
        type = 'rock'
        color = rockColors[Math.floor(Math.random() * rockColors.length)]
        scale = 0.5 + Math.random() * 1.5
      } else if (typeRoll > 0.4) {
        type = 'mushroom'
        color = mushroomColors[Math.floor(Math.random() * mushroomColors.length)]
        scale = 0.4 + Math.random() * 0.6
      } else {
        type = 'flower'
        color = flowerColors[Math.floor(Math.random() * flowerColors.length)]
        scale = 0.3 + Math.random() * 0.4
      }

      items.push({
        position: [x, y, z],
        type,
        color,
        scale,
        rotation: [
          (Math.random() - 0.5) * 0.3,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.3,
        ],
      })
    }

    return items
  }, [noise])

  useFrame((_, delta) => {
    if (!decorationsRef.current) return
    decorationsRef.current.children.forEach((child, i) => {
      const item = decorations[i]
      if (item.type === 'flower') {
        child.rotation.z = Math.sin(Date.now() * 0.001 + i) * 0.1
      }
    })
  })

  return (
    <group ref={decorationsRef}>
      {decorations.map((item, i) => (
        <group
          key={i}
          position={item.position}
          rotation={item.rotation}
          scale={[item.scale, item.scale, item.scale]}
        >
          {item.type === 'rock' && (
            <mesh castShadow receiveShadow>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={item.color} roughness={0.9} />
            </mesh>
          )}
          {item.type === 'mushroom' && (
            <group>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 1, 8]} />
                <meshStandardMaterial color="#F4F1DE" roughness={0.8} />
              </mesh>
              <mesh position={[0, 1.2, 0]} castShadow>
                <sphereGeometry args={[0.7, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={item.color} roughness={0.7} />
              </mesh>
              <mesh position={[0, 1.3, 0.5]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
              </mesh>
              <mesh position={[0.3, 1.4, 0.3]}>
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
              </mesh>
            </group>
          )}
          {item.type === 'flower' && (
            <group>
              <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
                <meshStandardMaterial color="#81B29A" roughness={0.8} />
              </mesh>
              {[0, 1, 2, 3, 4].map(petal => (
                <mesh
                  key={petal}
                  position={[
                    Math.cos(petal * Math.PI * 0.4) * 0.25,
                    0.9,
                    Math.sin(petal * Math.PI * 0.4) * 0.25,
                  ]}
                  rotation={[Math.PI / 2, 0, petal * Math.PI * 0.4]}
                  castShadow
                >
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshStandardMaterial color={item.color} roughness={0.7} />
                </mesh>
              ))}
              <mesh position={[0, 0.9, 0]} castShadow>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#FFE66D" roughness={0.6} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  )
}
