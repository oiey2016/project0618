import React, { useState } from 'react';
import { PixelBlock as PixelBlockType } from '@/types';
import { PixelBlock } from './PixelBlock';

interface BlockTrayProps {
  blocks: PixelBlockType[];
  blockSize?: number;
}

export const BlockTray: React.FC<BlockTrayProps> = ({ 
  blocks, 
  blockSize = 44 
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <div className="pixel-border bg-cream-100 p-4">
      <div className="text-center mb-3">
        <span className="text-lg font-bold text-gray-700">🎨 方块托盘</span>
        <span className="ml-2 text-sm text-gray-500">
          (剩余 {blocks.length} 个)
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center min-h-[60px] max-h-[180px] overflow-y-auto no-scrollbar p-2 bg-white/50 rounded">
        {blocks.length === 0 ? (
          <div className="text-gray-400 text-sm py-4">
            太棒了！所有方块都已放置 ✨
          </div>
        ) : (
          blocks.map((block) => (
            <PixelBlock
              key={block.id}
              block={block}
              size={blockSize}
              isDragging={draggingId === block.id}
              onDragStart={() => setDraggingId(block.id)}
              onDragEnd={() => setDraggingId(null)}
            />
          ))
        )}
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        💡 拖拽方块到上方网格的正确位置
      </p>
    </div>
  );
};
