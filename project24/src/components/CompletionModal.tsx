import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Home } from 'lucide-react';
import { PixelButton } from './ui/PixelButton';
import { StarRating } from './ui/StarRating';
import { formatTime } from '@/utils/helpers';
import { ColorKey, COLORS } from '@/types';

interface CompletionModalProps {
  isOpen: boolean;
  levelName: string;
  stars: number;
  time: number;
  mistakes: number;
  pattern: ColorKey[][];
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
  hasNextLevel: boolean;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  levelName,
  stars,
  time,
  mistakes,
  pattern,
  onNextLevel,
  onReplay,
  onHome,
  hasNextLevel,
}) => {
  if (!isOpen) return null;

  const size = pattern.length;
  const cellSize = 200 / size;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="pixel-border bg-white p-8 max-w-md w-full animate-pop">
        <div className="text-center">
          <div className="flex justify-center mb-4">
        <Trophy size={64} className="text-yellow-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2 rainbow-stripe">
            🎉 太棒了！
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            成功完成「{levelName}」
          </p>

          <div
            className="mx-auto mb-6 bg-cream-100 p-2 inline-block pixel-border"
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
                  key={`complete-${rowIndex}-${colIndex}`}
                  className={color === 'empty' ? 'bg-gray-100/50' : ''}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color !== 'empty' ? COLORS[color] : undefined,
                    animation: `pixel-glow 1.5s ease-in-out infinite`,
                    animationDelay: `${(rowIndex + colIndex) * 50}ms`,
                  }}
                />
              ))
            )}
          </div>

          <StarRating stars={stars} size={40} animate />

          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-candy-teal">
                {formatTime(time)}
              </div>
              <div className="text-sm text-gray-500">用时</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {mistakes}
              </div>
              <div className="text-sm text-gray-500">错误</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hasNextLevel && (
              <PixelButton
                variant="primary"
                size="lg"
                onClick={onNextLevel}
                className="flex items-center justify-center gap-2 w-full"
              >
                下一关 <ArrowRight size={20} />
              </PixelButton>
            )}
            
            <div className="flex gap-3">
              <PixelButton
                variant="secondary"
                size="md"
                onClick={onReplay}
                className="flex items-center justify-center gap-2 flex-1"
              >
                <RotateCcw size={18} />
                再玩一次
              </PixelButton>
              
              <PixelButton
                variant="ghost"
                size="md"
                onClick={onHome}
                className="flex items-center justify-center gap-2 flex-1"
              >
                <Home size={18} />
                返回首页
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
