import React, { useCallback } from 'react';
import { PixelBlock as PixelBlockType, COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface PixelBlockProps {
  block: PixelBlockType;
  size?: number;
  isDragging?: boolean;
  onDragStart?: (block: PixelBlockType) => void;
  onDragEnd?: () => void;
}

export const PixelBlock: React.FC<PixelBlockProps> = ({
  block,
  size = 40,
  isDragging = false,
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (block.isPlaced) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('blockId', block.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(block);
  }, [block, onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd?.();
  }, [onDragEnd]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (block.isPlaced) return;
    e.preventDefault();
    onDragStart?.(block);
  }, [block, onDragStart]);

  const color = COLORS[block.color];

  return (
    <div
      draggable={!block.isPlaced}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      className={cn(
        'pixel-block',
        isDragging && 'dragging',
        block.isPlaced && 'cursor-default'
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
};
