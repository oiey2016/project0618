import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HealthBarProps {
  current: number;
  max: number;
  showHeart?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthBar({ current, max, showHeart = true, size = 'md' }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const sizeMap = {
    sm: { bar: 'h-1.5', text: 'text-xs' },
    md: { bar: 'h-2.5', text: 'text-xs' },
    lg: { bar: 'h-4', text: 'text-sm' },
  };
  
  const getBarColor = () => {
    if (percentage > 60) return 'from-mint-400 to-mint-500';
    if (percentage > 30) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showHeart && (
          <Heart className={`w-3.5 h-3.5 text-red-400 ${sizeMap[size].text}`} fill="currentColor" />
        )}
        <span className={`font-mono font-bold text-coffee-500 ${sizeMap[size].text}`}>
          {Math.floor(current)} / {Math.floor(max)}
        </span>
      </div>
      <div className={`w-full bg-cream-200 rounded-full overflow-hidden shadow-inner-soft ${sizeMap[size].bar}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${getBarColor()} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
