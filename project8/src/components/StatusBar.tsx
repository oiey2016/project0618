import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Heart, Utensils, ShieldAlert } from 'lucide-react';

interface StatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  pulseEffect?: string;
}

const Stat: React.FC<StatProps> = ({
  label,
  value,
  icon,
  gradient,
  glowColor,
  warningThreshold = 30,
  dangerThreshold = 15,
  pulseEffect,
}) => {
  const isDanger = value <= dangerThreshold;
  const isWarning = value <= warningThreshold && value > dangerThreshold;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-text-primary" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          <span
            className={`transition-all duration-300 ${
              isDanger ? 'text-neon-red animate-pulse' : isWarning ? 'text-neon-orange' : ''
            }`}
          >
            {icon}
          </span>
          {label}
        </span>
        <span
          className={`font-bold tabular-nums ${
            isDanger ? 'text-neon-red animate-pulse' : isWarning ? 'text-neon-orange' : 'text-text-primary'
          }`}
          style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem' }}
        >
          {Math.round(value)}%
        </span>
      </div>
      <div
        className={`relative h-3 rounded-full overflow-hidden
          bg-bg-dark/80 border border-white/5
          ${isDanger ? 'animate-danger-pulse' : ''}`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out
            ${gradient} ${pulseEffect || ''}`}
          style={{
            width: `${value}%`,
            boxShadow: isDanger || isWarning ? `0 0 12px ${glowColor}` : `0 0 6px ${glowColor}`,
          }}
        />
        <div className="absolute inset-0 bg-noise/10 pointer-events-none" />
        {isDanger && (
          <div className="absolute inset-0 bg-neon-red/20 animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
};

const StatusBar: React.FC = () => {
  const health = useGameStore((s) => s.health);
  const hunger = useGameStore((s) => s.hunger);
  const trust = useGameStore((s) => s.trust);

  return (
    <div className="space-y-4 p-4 bg-gradient-to-b from-bg-purple/30 to-bg-dark/60 backdrop-blur border-b border-neon-cyan/20">
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-sm text-neon-cyan tracking-widest"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          // 生命体征
        </h3>
        <div className="h-px flex-1 ml-3 bg-gradient-to-r from-neon-cyan/50 to-transparent" />
      </div>
      <Stat
        label="生命值"
        value={health}
        icon={<Heart size={14} />}
        gradient="bg-gradient-to-r from-neon-red via-rose-500 to-pink-500"
        glowColor="rgba(255,59,59,0.7)"
        pulseEffect={health > 50 ? 'animate-heartbeat' : ''}
      />
      <Stat
        label="饱食度"
        value={hunger}
        icon={<Utensils size={14} />}
        gradient="bg-gradient-to-r from-neon-orange via-amber-500 to-yellow-400"
        glowColor="rgba(255,159,28,0.7)"
      />
      <Stat
        label="信任度"
        value={trust}
        icon={<ShieldAlert size={14} />}
        gradient="bg-gradient-to-r from-neon-cyan via-sky-400 to-indigo-500"
        glowColor="rgba(0,240,255,0.7)"
      />
    </div>
  );
};

export default StatusBar;
