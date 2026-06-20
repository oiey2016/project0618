import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import Block from './Block';
import { parseBlockKey, isExposed } from '@/utils/terrain';
import { BlockType } from '@/types';

interface WorldProps {
  onBlockClick?: (x: number, y: number, z: number, faceNormal: { x: number; y: number; z: number }) => void;
}

export default function World({ onBlockClick }: WorldProps) {
  const blocks = useGameStore((state) => state.world.blocks);

  const visibleBlocks = useMemo(() => {
    const visible: { key: string; type: BlockType; position: [number, number, number] }[] = [];

    blocks.forEach((type, key) => {
      if (type === BlockType.AIR) return;

      const { x, y, z } = parseBlockKey(key);
      
      if (isExposed(x, y, z, blocks)) {
        visible.push({
          key,
          type,
          position: [x, y, z],
        });
      }
    });

    return visible;
  }, [blocks]);

  return (
    <group>
      {visibleBlocks.map(({ key, type, position }) => (
        <Block key={key} position={position} type={type} />
      ))}
    </group>
  );
}
