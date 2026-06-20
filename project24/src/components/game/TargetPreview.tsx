import React from 'react';
import { ColorKey, COLORS } from '@/types';

interface TargetPreviewProps {
  pattern: ColorKey[][];
  cellSize?: number;
}

export const TargetPreview: React.FC<TargetPreviewProps> = ({ 
  pattern, 
  cellSize = 14 
}) => {
  const size = pattern.length;

  return (
    <div className="pixel-border bg-white p-3 inline-block w-full lg:w-auto">
      <div className="text-center mb-2">
        <span className="text-sm font-bold text-gray-700">🎯 目标图案</span>
      </div>
      <div
        className="mx-auto bg-cream-100 p-1 w-fit"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
          gap: '1px',
        }}
      >
        {pattern.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`preview-${rowIndex}-${colIndex}`}
              className={color === 'empty' ? 'bg-gray-100/50' : ''}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: color !== 'empty' ? COLORS[color] : undefined,
                border: color !== 'empty' ? '1px solid rgba(0,0,0,0.1)' : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
