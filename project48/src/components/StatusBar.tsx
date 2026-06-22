import { useGameStore } from '@/store/gameStore';
import { Heart, Zap, Target } from 'lucide-react';

interface StatusBarProps {
  songTitle: string;
  currentTime: number;
  duration: number;
}

export function StatusBar({ songTitle, currentTime, duration }: StatusBarProps) {
  const { score, combo, maxCombo, health } = useGameStore();
  const progress = Math.min(100, (currentTime / duration) * 100);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full glass-card p-4 mb-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-gray-800 truncate">{songTitle}</h3>
            <p className="text-xs text-gray-500 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Heart
              className={`w-5 h-5 ${
                health > 50 ? 'text-rose-500 fill-rose-500' : 'text-gray-400 fill-gray-400'
              }`}
            />
            <div className="w-24 h-3 rounded-full bg-white/50 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  health > 50
                    ? 'bg-gradient-to-r from-rose-400 to-pink-500'
                    : health > 20
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}
                style={{ width: `${health}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600 w-8">{health}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-white/50 overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Score</p>
          <p className="font-display font-black text-3xl md:text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-none">
            {score.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Zap
              className={`w-5 h-5 ${
                combo >= 10 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-gray-400'
              }`}
            />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Combo</p>
          </div>
          <p
            className={`combo-display text-4xl md:text-5xl leading-none ${
              combo >= 50
                ? 'text-yellow-500'
                : combo >= 20
                ? 'text-pink-500'
                : combo >= 10
                ? 'text-purple-500'
                : 'text-gray-700'
            }`}
          >
            {combo}
            <span className="text-lg md:text-xl text-gray-400 ml-1 font-bold">/ {maxCombo}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
