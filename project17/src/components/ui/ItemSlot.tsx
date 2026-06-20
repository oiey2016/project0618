import { motion } from 'framer-motion';
import {
  Key, Flame, Lightbulb, Axe, Image, FileText, Newspaper, Package,
} from 'lucide-react';
import { Item } from '@/types/game';
import { cn } from '@/lib/utils';

interface ItemSlotProps {
  item: Item | null;
  selected?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  key: Key,
  flame: Flame,
  lightbulb: Lightbulb,
  axe: Axe,
  image: Image,
  'file-text': FileText,
  newspaper: Newspaper,
  package: Package,
};

export function ItemSlot({ item, selected, onClick }: ItemSlotProps) {
  const Icon = item ? iconMap[item.icon] || Package : null;

  return (
    <motion.button
      whileHover={item ? { scale: 1.1 } : {}}
      whileTap={item ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        'relative w-16 h-16 rounded-lg border-2 transition-all duration-200',
        'bg-gradient-to-br from-old-brown to-aged-wood',
        'flex items-center justify-center',
        item ? 'cursor-pointer' : 'cursor-default',
        selected
          ? 'border-blood-red shadow-[0_0_15px_rgba(139,38,53,0.5)]'
          : 'border-rust hover:border-blood-red/70',
        !item && 'opacity-40'
      )}
      title={item?.name}
      disabled={!item}
    >
      {item && Icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon className="w-8 h-8 text-bone-white" />
        </motion.div>
      )}
      {selected && (
        <motion.div
          layoutId="selected-item-glow"
          className="absolute inset-0 rounded-lg border-2 border-blood-red animate-pulse"
        />
      )}
    </motion.button>
  );
}
