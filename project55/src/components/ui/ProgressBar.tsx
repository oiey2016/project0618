import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'green' | 'red' | 'blue' | 'purple' | 'yellow';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const colorMap = {
  green: 'from-mint-400 to-mint-500',
  red: 'from-red-400 to-red-500',
  blue: 'from-blue-400 to-blue-500',
  purple: 'from-lavender-400 to-lavender-500',
  yellow: 'from-yellow-400 to-yellow-500',
};

const heightMap = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-5',
};

export function ProgressBar({
  value,
  max,
  color = 'green',
  height = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-coffee-500">
            {label || `${Math.floor(value)} / ${Math.floor(max)}`}
          </span>
          <span className="text-xs font-mono text-coffee-400">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={cn('stat-bar', heightMap[height])}>
        <motion.div
          className={cn('stat-bar-fill bg-gradient-to-r', colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
