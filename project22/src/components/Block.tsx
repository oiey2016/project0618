import { useRef } from 'react';
import { Mesh } from 'three';
import { BLOCK_CONFIG } from '@/constants/blocks';
import { BlockType } from '@/types';

interface BlockProps {
  position: [number, number, number];
  type: BlockType;
}

export default function Block({ position, type }: BlockProps) {
  const meshRef = useRef<Mesh>(null);
  const config = BLOCK_CONFIG[type];

  if (!config || config.transparent && type === BlockType.AIR) {
    return null;
  }

  const [x, y, z] = position;
  const adjustedPosition: [number, number, number] = [x + 0.5, y + 0.5, z + 0.5];

  return (
    <mesh
      ref={meshRef}
      position={adjustedPosition}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={config.color}
        transparent={config.transparent}
        opacity={type === BlockType.WATER ? 0.6 : type === BlockType.LEAVES ? 0.85 : 1}
      />
    </mesh>
  );
}
