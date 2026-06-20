import React, { useState, useCallback } from 'react';
import { ColorKey, COLORS, PixelBlock as PixelBlockType } from '@/types';
import { cn } from '@/lib/utils';

interface PixelGridProps {
  gridSize: number;
  pattern: ColorKey[][];
  filledGrid: (ColorKey | null)[][];
  hintCell: { row: number; col: number } | null;
  animatingCell: { row: number; col: number; type: 'success' | 'error' } | null;
  onDrop: (blockId: string, row: number, col: number) => void;
  cellSize?: number;
}

export const PixelGrid: React.FC<PixelGridProps> = ({
  gridSize,
  pattern,
  filledGrid,
  hintCell,
  animatingCell,
  onDrop,
  cellSize = 48,
}) => {
  const [dragOverCell, setDragOverCell] = useState<{ row: number; col: number } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOverCell || dragOverCell.row !== row || dragOverCell.col !== col) {
      setDragOverCell({ row, col });
    }
  }, [dragOverCell]);

  const handleDragLeave = useCallback(() => {
    setDragOverCell(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setDragOverCell(null);
    const blockId = e.dataTransfer.getData('blockId');
    if (blockId) {
      onDrop(blockId, row, col);
    }
  }, [onDrop]);

  const isDragOver = (row: number, col: number) => 
    dragOverCell?.row === row && dragOverCell?.col === col;

  const isHint = (row: number, col: number) =>
    hintCell?.row === row && hintCell?.col === col;

  const isAnimating = (row: number, col: number) =>
    animatingCell?.row === row && animatingCell?.col === col;

  const getAnimationClass = (row: number, col: number) => {
    if (!isAnimating(row, col)) return '';
    return animatingCell?.type === 'success' ? 'place-success' : 'wrong-shake';
  };

  const getCellBg = (row: number, col: number) => {
    const targetColor = pattern[row][col];
    if (targetColor === 'empty') return 'bg-gray-100/30';
    return 'bg-white/50';
  };

  return (
    <div
      className="pixel-border bg-cream-100 p-2 inline-block"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        gap: '1px',
      }}
    >
      {pattern.map((row, rowIndex) =>
        row.map((targetColor, colIndex) => {
          const filledColor = filledGrid[rowIndex]?.[colIndex];
          const isFilled = filledColor !== null;
          const showHint = isHint(rowIndex, colIndex) && !isFilled;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'grid-cell relative flex items-center justify-center transition-all duration-150',
                getCellBg(rowIndex, colIndex),
                isDragOver(rowIndex, colIndex) && 'drag-over',
                isFilled && 'filled',
                showHint && 'animate-pulse',
                getAnimationClass(rowIndex, colIndex)
              )}
              style={{
                width: cellSize,
                height: cellSize,
              }}
              onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            >
              {showHint && (
                <div
                  className="absolute inset-1 border-2 border-dashed border-candy-teal animate-pulse"
                  style={{
                    backgroundColor: COLORS[targetColor],
                    opacity: 0.4,
                  }}
                />
              )}
              {isFilled && filledColor && (
                <div
                  className="pixel-block w-full h-full"
                  style={{
                    backgroundColor: COLORS[filledColor],
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
