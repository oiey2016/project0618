import React from 'react';
import { Lock } from 'lucide-react';
import { Level, COLORS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/types';
import { PixelCard } from './ui/PixelCard';
import { StarRating } from './ui/StarRating';
import { isLevelUnlocked } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: Level;
  completedInfo?: { stars: number; time: number };
  completedLevels: Record<number, { stars: number; time: number }>;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  completedInfo,
  completedLevels,
  onClick,
}) => {
  const unlocked = isLevelUnlocked(level.id, completedLevels);
  const difficultyColor = DIFFICULTY_COLORS[level.difficulty];

  const renderThumbnail = () => {
    const size = level.gridSize;
    const cellSize = 64 / size;

    return (
      <div
        className="mx-auto bg-cream-100 p-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
          gap: '1px',
        }}
      >
        {level.pattern.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`thumb-${rowIndex}-${colIndex}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: color !== 'empty' ? COLORS[color] : '#f5f5f5',
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <PixelCard
      hoverable={unlocked}
      className={cn(
        'w-full transition-all duration-300',
        !unlocked && 'opacity-60 cursor-not-allowed'
      )}
      onClick={unlocked ? onClick : undefined}
    >
      <div className="relative">
        {!unlocked && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <Lock size={32} className="text-white drop-shadow-lg" />
          </div>
        )}
        
        <div className="mb-3">
          {renderThumbnail()}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {level.name}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 text-xs font-bold rounded"
              style={{ 
                backgroundColor: difficultyColor,
                color: '#fff'
              }}
            >
              {DIFFICULTY_LABELS[level.difficulty]}
            </span>
            <span className="text-xs text-gray-500">
              {level.gridSize}×{level.gridSize}
            </span>
          </div>

          {completedInfo ? (
            <div>
              <StarRating stars={completedInfo.stars} size={20} />
              <p className="text-xs text-gray-500 mt-1">
              最佳时间: {Math.floor(completedInfo.time)}秒
              </p>
            </div>
          ) : unlocked ? (
            <p className="text-sm text-gray-400">点击开始</p>
          ) : (
            <p className="text-sm text-gray-400">完成上一关解锁</p>
          )}
        </div>
      </div>
    </PixelCard>
  );
};
