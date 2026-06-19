import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Wifi, WifiOff } from 'lucide-react';

const getAvatarMood = (health: number, trust: number) => {
  if (health <= 20) return 'wounded';
  if (trust >= 70) return 'happy';
  if (trust <= 25) return 'scared';
  return 'neutral';
};

const Avatar: React.FC = () => {
  const health = useGameStore((s) => s.health);
  const trust = useGameStore((s) => s.trust);
  const typing = useGameStore((s) => s.typing);
  const mood = getAvatarMood(health, trust);

  const moodColors: Record<string, string> = {
    happy: 'ring-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.5)]',
    wounded: 'ring-neon-red shadow-[0_0_20px_rgba(255,59,59,0.6)]',
    scared: 'ring-neon-orange shadow-[0_0_15px_rgba(255,159,28,0.5)]',
    neutral: 'ring-neon-pink shadow-[0_0_15px_rgba(255,45,149,0.4)]',
  };

  const moodEmoji: Record<string, string> = {
    happy: '😊',
    wounded: '😣',
    scared: '😰',
    neutral: '😐',
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-neon-pink/30 bg-gradient-to-r from-bg-dark/80 to-bg-purple/50 backdrop-blur">
      <div className="relative">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl
            bg-gradient-to-br from-bg-purple to-bg-dark
            border-2 ${moodColors[mood]}
            transition-all duration-700 animate-avatar-breathe`}
          style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,45,149,0.3), transparent 60%)`,
          }}
        >
          {moodEmoji[mood]}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-bg-dark
            ${typing ? 'bg-neon-cyan animate-pulse' : 'bg-neon-green'}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2
            className="text-lg font-bold text-neon-pink tracking-wider"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            ZERO
          </h2>
          {typing ? (
            <span className="flex items-center gap-1 text-xs text-neon-cyan animate-pulse">
              <Wifi size={12} />
              输入中...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-neon-green">
              <Wifi size={12} />
              在线
            </span>
          )}
        </div>
        <p
          className="text-xs text-text-muted truncate"
          style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
        >
          {mood === 'happy' && '她看起来很安心...'}
          {mood === 'wounded' && '她受伤了，需要帮助...'}
          {mood === 'scared' && '她正在发抖...'}
          {mood === 'neutral' && '等待你的指令'}
        </p>
      </div>
    </div>
  );
};

export default Avatar;
