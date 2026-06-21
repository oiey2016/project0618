import { Heart, Droplets, Utensils, Sun, Moon, Calendar, HelpCircle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const StatusBar = () => {
  const { day, phase, phaseProgress, player, hasSeenGameplay, toggleGameplay } = useGameStore();

  const healthPercent = (player.health / player.maxHealth) * 100;
  const hungerPercent = player.hunger;
  const thirstPercent = player.thirst;

  const getHealthColor = () => {
    if (healthPercent > 60) return 'bg-safe-500';
    if (healthPercent > 30) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const getHungerColor = () => {
    if (hungerPercent > 60) return 'bg-amber-500';
    if (hungerPercent > 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getThirstColor = () => {
    if (thirstPercent > 60) return 'bg-blue-500';
    if (thirstPercent > 30) return 'bg-cyan-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-r from-wasteland-surface via-wasteland-surface2 to-wasteland-surface border-b border-wasteland-border px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-wasteland-bg rounded border border-wasteland-border">
            <Calendar className="w-4 h-4 text-rust-500" />
            <span className="text-sm font-bold text-rust-400">第 {day} 天</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-wasteland-bg rounded border border-wasteland-border">
            {phase === 'day' ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-300" />
            )}
            <span className="text-sm text-wasteland-text">
              {phase === 'day' ? '白天' : '夜晚'}
            </span>
            <div className="w-16 h-1.5 bg-wasteland-border rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${phase === 'day' ? 'bg-yellow-500' : 'bg-blue-400'}`}
                style={{ width: `${phaseProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasSeenGameplay && (
            <button
              onClick={toggleGameplay}
              className="p-2 rounded-lg bg-wasteland-bg border border-wasteland-border hover:border-rust-500 transition-colors"
              title="游戏玩法"
            >
              <HelpCircle className="w-5 h-5 text-rust-500" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-36">
            <Heart className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <div className="h-3 bg-wasteland-bg border border-wasteland-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${getHealthColor()} transition-all duration-300`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
              <div className="text-xs text-wasteland-muted mt-0.5">
                {Math.floor(player.health)} / {player.maxHealth}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-32">
            <Utensils className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              <div className="h-3 bg-wasteland-bg border border-wasteland-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${getHungerColor()} transition-all duration-300`}
                  style={{ width: `${hungerPercent}%` }}
                />
              </div>
              <div className="text-xs text-wasteland-muted mt-0.5">
                饥饿 {Math.floor(player.hunger)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-32">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <div className="h-3 bg-wasteland-bg border border-wasteland-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${getThirstColor()} transition-all duration-300`}
                  style={{ width: `${thirstPercent}%` }}
                />
              </div>
              <div className="text-xs text-wasteland-muted mt-0.5">
                口渴 {Math.floor(player.thirst)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
