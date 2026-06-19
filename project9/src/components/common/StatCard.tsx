import { cn } from '@/lib/utils';
import ProgressRing from './ProgressRing';
import type { LucideIcon } from 'lucide-react';

type StatColor = 'gold' | 'plasma' | 'alert' | 'blue';

interface StatCardProps {
  label: string;
  value: number;
  max?: number;
  icon: LucideIcon;
  color: StatColor;
  progress?: number;
  className?: string;
}

const colorConfig: Record<StatColor, { ring: string; text: string; glow: string; bg: string }> = {
  gold: {
    ring: '#d4af37',
    text: 'text-stardust-200',
    glow: 'shadow-[0_0_15px_rgba(212,175,55,0.25)]',
    bg: 'from-stardust-500/10 to-transparent',
  },
  plasma: {
    ring: '#00d4ff',
    text: 'text-plasma-100',
    glow: 'shadow-[0_0_15px_rgba(0,212,255,0.25)]',
    bg: 'from-plasma-500/10 to-transparent',
  },
  alert: {
    ring: '#ff4d6d',
    text: 'text-alert-300',
    glow: 'shadow-[0_0_15px_rgba(255,77,109,0.25)]',
    bg: 'from-alert-500/10 to-transparent',
  },
  blue: {
    ring: '#8A94D6',
    text: 'text-space-100',
    glow: 'shadow-[0_0_15px_rgba(138,148,214,0.25)]',
    bg: 'from-space-300/10 to-transparent',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  max,
  icon,
  color,
  progress,
  className,
}) => {
  const cfg = colorConfig[color];
  const displayProgress =
    progress !== undefined
      ? progress
      : max !== undefined
      ? (value / max) * 100
      : Math.min(100, value);

  return (
    <div
      className={cn(
        'ornate-border rounded-sm p-3 flex items-center gap-3',
        'bg-gradient-to-br',
        cfg.bg,
        cfg.glow,
        className
      )}
    >
      <ProgressRing
        value={displayProgress}
        size={56}
        strokeWidth={3.5}
        color={cfg.ring}
        icon={icon}
      />
      <div className="flex flex-col min-w-0 flex-1">
        <span className={cn('text-[10px] uppercase tracking-widest font-display opacity-70', cfg.text)}>
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={cn('font-display text-xl font-bold leading-tight', cfg.text)}>
            {value.toLocaleString()}
          </span>
          {max !== undefined && (
            <span className="text-xs opacity-50 font-display">/ {max.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
