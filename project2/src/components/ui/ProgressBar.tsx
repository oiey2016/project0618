import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: 'amber' | 'green' | 'blue' | 'red';
  showLabel?: boolean;
}

export const ProgressBar = ({
  value,
  max,
  className,
  color = 'amber',
  showLabel = false,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    amber: 'from-amber-500 to-amber-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="h-4 bg-stone-900 rounded-full overflow-hidden border border-stone-700">
        <motion.div
          className={cn('h-full bg-gradient-to-r', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-stone-400 mt-1 text-right">
          {Math.floor(value)} / {Math.floor(max)}
        </div>
      )}
    </div>
  );
};
