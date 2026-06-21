import { useGameStore } from '../store/useGameStore';
import { Skull, Play, RotateCcw } from 'lucide-react';

export const StartScreen = () => {
  const { startGame, day } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-wasteland-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-wasteland-bg" />
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🧟</div>
        <div className="absolute top-40 right-20 text-5xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>🧟‍♂️</div>
        <div className="absolute bottom-32 left-1/4 text-4xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🧟‍♀️</div>
        <div className="absolute bottom-20 right-1/3 text-5xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>💀</div>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-red-500" />
            <h1 className="text-5xl font-bold text-rust-400 text-glow-rust tracking-wider">
              末日求生
            </h1>
            <Skull className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl text-wasteland-muted">ZOMBIE SURVIVAL</p>
        </div>

        <div className="card-wasteland p-6 mb-8 max-w-md mx-auto">
          <p className="text-wasteland-text mb-4">
            僵尸病毒席卷全球，你是为数不多的幸存者之一。
            在这片废土上，你需要建造庇护所、收集资源、制作武器，
            才能在每晚的僵尸袭击中存活下来。
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-wasteland-muted">
              <span className="text-xl">🏠</span>
              <span>建造庇护所</span>
            </div>
            <div className="flex items-center gap-2 text-wasteland-muted">
              <span className="text-xl">📦</span>
              <span>收集资源</span>
            </div>
            <div className="flex items-center gap-2 text-wasteland-muted">
              <span className="text-xl">⚔️</span>
              <span>制作武器</span>
            </div>
            <div className="flex items-center gap-2 text-wasteland-muted">
              <span className="text-xl">🧟</span>
              <span>抵御僵尸</span>
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="
            group inline-flex items-center gap-3 px-8 py-4 rounded-lg
            bg-gradient-to-r from-rust-700 to-rust-600
            border-2 border-rust-500
            text-xl font-bold text-white
            hover:from-rust-600 hover:to-rust-500
            hover:shadow-rust-glow
            hover:scale-105
            transition-all duration-300
          "
        >
          <Play className="w-6 h-6 group-hover:animate-pulse" />
          开始生存
        </button>

        <p className="mt-6 text-sm text-wasteland-muted">
          提示：白天收集资源建造，夜晚僵尸来袭
        </p>
      </div>
    </div>
  );
};

export const GameOverScreen = () => {
  const { restartGame, day } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="text-center px-6">
        <div className="mb-6">
          <Skull className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-red-500 text-glow-danger mb-2">
            你死了
          </h1>
          <p className="text-xl text-wasteland-muted">GAME OVER</p>
        </div>

        <div className="card-wasteland p-6 mb-8 max-w-sm mx-auto">
          <div className="text-wasteland-muted mb-2">生存天数</div>
          <div className="text-5xl font-bold text-rust-400 text-glow-rust mb-4">
            {day}
          </div>
          <p className="text-sm text-wasteland-muted">
            {day < 3 ? '你还没准备好面对末日...' :
             day < 7 ? '你已经很努力了，但还不够...' :
             day < 14 ? '不错的成绩，末日生存专家！' :
             '传奇幸存者！你在末日中坚持了很久！'}
          </p>
        </div>

        <button
          onClick={restartGame}
          className="
            group inline-flex items-center gap-3 px-8 py-4 rounded-lg
            bg-gradient-to-r from-military-700 to-military-600
            border-2 border-military-500
            text-xl font-bold text-white
            hover:from-military-600 hover:to-military-500
            hover:shadow-safe-glow
            hover:scale-105
            transition-all duration-300
          "
        >
          <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          重新开始
        </button>
      </div>
    </div>
  );
};
