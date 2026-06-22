import { useEffect, useState } from 'react';
import { RotateCcw, Home, Trophy, Target, Zap, Heart } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getGrade } from '@/game/config';
import { setHighScore, getHighScore } from '@/utils/storage';
import { audioManager } from '@/utils/audioManager';

interface ResultScreenProps {
  onRestart: () => void;
  onHome: () => void;
}

export default function ResultScreen({ onRestart, onHome }: ResultScreenProps) {
  const { score, maxCombo, perfectCount, greatCount, goodCount, missCount } = useGameStore();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalNotes = perfectCount + greatCount + goodCount + missCount;
  const accuracy = totalNotes > 0
    ? ((perfectCount * 100 + greatCount * 70 + goodCount * 40) / (totalNotes * 100)) * 100
    : 0;

  const { grade, color } = getGrade(accuracy);

  useEffect(() => {
    const previousHigh = getHighScore();
    if (score > previousHigh) {
      setHighScore(score);
      setIsNewHighScore(true);
    }

    setTimeout(() => setMounted(true), 100);
  }, [score]);

  const handleRestart = () => {
    audioManager.activateInGesture();
    audioManager.playClick();
    onRestart();
  };

  const handleHome = () => {
    audioManager.activateInGesture();
    audioManager.playClick();
    onHome();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      <div
        className={`relative z-10 w-full max-w-sm transition-all duration-700 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="text-center mb-6">
          <div className="text-sm text-white/50 mb-2">演奏结束</div>
          <div className="text-3xl font-extralight text-white glow-text">
            {isNewHighScore && '🎉 '}
            {grade}
          </div>
          {isNewHighScore && (
            <div className="text-sm text-accent-yellow mt-2 animate-pulse">
              ★ 新纪录 ★
            </div>
          )}
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-xs text-white/50 mb-1">总分</div>
            <div className="text-5xl font-extralight text-white glow-text">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-accent-yellow" />
              <div>
                <div className="text-xs text-white/40">最大连击</div>
                <div className="text-lg font-light text-white">{maxCombo}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary" />
              <div>
                <div className="text-xs text-white/40">准确率</div>
                <div className="text-lg font-light text-white">{accuracy.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-xs text-white/40 mb-1">Perfect</div>
                <div className="text-sm text-primary font-medium">{perfectCount}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Great</div>
                <div className="text-sm text-secondary font-medium">{greatCount}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Good</div>
                <div className="text-sm text-accent-yellow font-medium">{goodCount}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Miss</div>
                <div className="text-sm text-accent-pink font-medium">{missCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRestart}
            className="glass-button py-4 px-8 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            再来一次
          </button>
          <button
            onClick={handleHome}
            className="glass-button py-3 px-8 bg-white/5 border-white/10 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
