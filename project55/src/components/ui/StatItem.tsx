import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  color?: 'mint' | 'coral' | 'lavender' | 'yellow';
  className?: string;
}

const colorMap = {
  mint: 'bg-mint-50 text-mint-600',
  coral: 'bg-coral-50 text-coral-600',
  lavender: 'bg-lavender-100 text-lavender-500',
  yellow: 'bg-yellow-50 text-yellow-600',
};

export function StatItem({ icon, label, value, color = 'mint', className }: StatItemProps) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl',
        colorMap[color],
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs opacity-75">{label}</p>
        <p className="font-mono font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
