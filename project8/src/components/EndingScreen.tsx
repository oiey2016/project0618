import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { RefreshCw, Skull, Star, Heart } from 'lucide-react';

const EndingScreen: React.FC = () => {
  const isGameOver = useGameStore((s) => s.isGameOver);
  const endingType = useGameStore((s) => s.endingType);
  const endingTitle = useGameStore((s) => s.endingTitle);
  const endingDescription = useGameStore((s) => s.endingDescription);
  const health = useGameStore((s) => s.health);
  const hunger = useGameStore((s) => s.hunger);
  const trust = useGameStore((s) => s.trust);
  const resetGame = useGameStore((s) => s.resetGame);

  if (!isGameOver) return null;

  const isDeath = endingType === 'death';
  const isGood = endingType === 'good';

  const Icon = isDeath ? Skull : isGood ? Star : Heart;
  const accentClass = isDeath
    ? 'from-neon-red via-rose-600 to-pink-700 text-neon-red shadow-[0_0_40px_rgba(255,59,59,0.5)]'
    : isGood
    ? 'from-neon-cyan via-sky-400 to-indigo-500 text-neon-cyan shadow-[0_0_40px_rgba(0,240,255,0.5)]'
    : 'from-neon-pink via-fuchsia-500 to-purple-600 text-neon-pink shadow-[0_0_40px_rgba(255,45,149,0.5)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-dark/90 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none" />

      <div className="relative max-w-md w-full">
        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full
          bg-gradient-to-br ${accentClass} flex items-center justify-center
          animate-avatar-breathe`}>
          <Icon size={48} className="text-white drop-shadow-lg" />
        </div>

        <div className={`pt-24 pb-8 px-8 rounded-2xl border-2 bg-bg-dark/80 backdrop-blur
          ${isDeath ? 'border-neon-red/50' : isGood ? 'border-neon-cyan/50' : 'border-neon-pink/50'}
          shadow-[0_0_60px_rgba(0,0,0,0.8)]`}>
          <div className="text-center space-y-6">
            <div>
              <p className="text-xs tracking-[0.4em] text-text-muted mb-2"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                — {isDeath ? 'GAME OVER' : 'ENDING'} —
              </p>
              <h2
                className={`text-3xl font-bold tracking-wider bg-gradient-to-r ${accentClass.split(' ').slice(0, 3).join(' ')} bg-clip-text text-transparent`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {endingTitle}
              </h2>
            </div>

            <div className="relative py-4">
              <div className="absolute top-1/2 left-0 w-8 h-px bg-gradient-to-r from-transparent to-neon-pink/50" />
              <div className="absolute top-1/2 right-0 w-8 h-px bg-gradient-to-l from-transparent to-neon-pink/50" />
              <p
                className="text-sm text-text-primary whitespace-pre-line leading-relaxed px-4"
                style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
              >
                {endingDescription}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {[
                { label: '生命', value: health, color: 'text-neon-red' },
                { label: '饱食', value: hunger, color: 'text-neon-orange' },
                { label: '信任', value: trust, color: 'text-neon-cyan' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-bold tabular-nums ${s.color}`}
                    style={{ fontFamily: "'VT323', monospace" }}>
                    {Math.round(s.value)}
                  </p>
                  <p className="text-[10px] text-text-muted tracking-wider"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="group relative w-full py-3.5 px-6 rounded-lg overflow-hidden
                bg-gradient-to-r from-neon-pink to-fuchsia-600 text-white font-bold tracking-wider
                hover:shadow-[0_0_30px_rgba(255,45,149,0.5)] transition-all duration-300
                hover:-translate-y-0.5 active:translate-y-0"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <RefreshCw size={16} className="group-hover:animate-spin" />
                重新开始
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingScreen;
