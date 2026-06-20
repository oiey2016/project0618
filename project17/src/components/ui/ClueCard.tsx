import { motion } from 'framer-motion';
import { Pin } from 'lucide-react';
import { Clue } from '@/types/game';
import { cn } from '@/lib/utils';

interface ClueCardProps {
  clue: Clue;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  draggable?: boolean;
  onDragStart?: any;
  onDragEnd?: any;
  onDragOver?: any;
  onDrop?: any;
}

export function ClueCard({
  clue,
  selected,
  onClick,
  style,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ClueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: Math.random() * 6 - 3 }}
      animate={{ opacity: 1, y: 0, rotate: Math.random() * 4 - 2 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      whileTap={{ scale: 0.98 }}
      style={style}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className={cn(
        'relative w-56 p-4 rounded shadow-xl cursor-pointer',
        'bg-gradient-to-br from-amber-50 to-amber-100',
        'border border-amber-200',
        selected && 'ring-2 ring-blood-red ring-offset-2 ring-offset-moss-green',
        'transform transition-transform'
      )}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <Pin className="w-5 h-5 text-blood-red" />
      </div>
      
      <h4 className="font-display text-lg font-bold text-old-brown mb-2 pr-2">
        {clue.title}
      </h4>
      
      <p className="font-body text-sm text-old-brown/80 leading-relaxed">
        {clue.content}
      </p>
      
      <div className="absolute bottom-2 right-3 text-xs text-old-brown/50 font-body italic">
        线索 #{clue.id.split('-').pop()}
      </div>
    </motion.div>
  );
}
