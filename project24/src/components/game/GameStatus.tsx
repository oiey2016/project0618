import React from 'react';
import { Clock, XCircle, Lightbulb, RotateCcw, Home } from 'lucide-react';
import { formatTime } from '@/utils/helpers';
import { PixelButton } from '../ui/PixelButton';

interface GameStatusProps {
  levelName: string;
  time: number;
  mistakes: number;
  progress: number;
  onHint: () => void;
  onReset: () => void;
  onBack: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  levelName,
  time,
  mistakes,
  progress,
  onHint,
  onReset,
  onBack,
}) => {
  return (
    <div className="pixel-border bg-white p-3 md:p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-4 md:gap-8">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">🎮 关卡</div>
            <div className="text-lg md:text-xl font-bold text-candy-pink">{levelName}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-candy-teal" />
            <div>
              <div className="text-xs text-gray-400 mb-0.5">⏱️ 用时</div>
              <div className="text-lg font-mono font-bold text-gray-700">{formatTime(time)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-red-400" />
            <div>
              <div className="text-xs text-gray-400 mb-0.5">❌ 错误</div>
              <div className="text-lg font-bold text-red-400">{mistakes}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={onHint}
            className="flex items-center gap-1"
          >
            <Lightbulb size={14} />
            <span className="hidden sm:inline">提示</span>
          </PixelButton>
          
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">重置</span>
          </PixelButton>
          
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1"
          >
            <Home size={14} />
            <span className="hidden sm:inline">返回</span>
          </PixelButton>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>进度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className="h-full transition-all duration-300 ease-out rainbow-stripe"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
