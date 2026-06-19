import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatusBarProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'green' | 'orange';
}

const colorClasses = {
  red: {
    text: 'text-neon-red',
    bg: 'bg-neon-red',
    glow: 'shadow-[0_0_10px_rgba(230,57,70,0.5)]',
    border: 'border-neon-red/50',
  },
  blue: {
    text: 'text-neon-blue',
    bg: 'bg-neon-blue',
    glow: 'shadow-[0_0_10px_rgba(72,202,228,0.5)]',
    border: 'border-neon-blue/50',
  },
  green: {
    text: 'text-neon-green',
    bg: 'bg-neon-green',
    glow: 'shadow-[0_0_10px_rgba(46,204,113,0.5)]',
    border: 'border-neon-green/50',
  },
  orange: {
    text: 'text-neon-orange',
    bg: 'bg-neon-orange',
    glow: 'shadow-[0_0_10px_rgba(255,159,28,0.5)]',
    border: 'border-neon-orange/50',
  },
};

const StatusBar = ({ label, value, icon: Icon, color }: StatusBarProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const colors = colorClasses[color];
  const isDanger = value <= 20;

  useEffect(() => {
    const start = displayValue;
    const end = value;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg border ${colors.border} bg-space-900/80 flex items-center justify-center ${isDanger ? 'animate-pulse' : ''}`}>
        <Icon size={18} className={colors.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-mono uppercase tracking-wider ${colors.text}`}>
            {label}
          </span>
          <span className={`text-xs font-mono ${colors.text} ${isDanger ? 'animate-pulse' : ''}`}>
            {displayValue}%
          </span>
        </div>
        <div className={`h-2 rounded-full bg-space-800 border ${colors.border} overflow-hidden`}>
          <div
            className={`h-full ${colors.bg} ${isDanger ? colors.glow : ''} transition-all duration-500 ease-out`}
            style={{ width: `${displayValue}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
