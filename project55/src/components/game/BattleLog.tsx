import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BattleLog as BattleLogType } from '../../types/game';

interface BattleLogProps {
  logs: BattleLogType[];
  maxHeight?: string;
}

const typeColors: Record<BattleLogType['type'], string> = {
  damage: 'text-red-500',
  heal: 'text-mint-500',
  gold: 'text-yellow-600',
  exp: 'text-lavender-500',
  levelup: 'text-coral-500',
  info: 'text-coffee-400',
};

export function BattleLog({ logs, maxHeight = '150px' }: BattleLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [logs]);
  
  return (
    <div 
      ref={containerRef}
      className="bg-cream-50/80 rounded-xl p-3 overflow-y-auto scrollbar-hide"
      style={{ maxHeight }}
    >
      <AnimatePresence initial={false}>
        {logs.length === 0 ? (
          <p className="text-center text-coffee-400 text-sm py-4">
            战斗日志将显示在这里...
          </p>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className={`text-xs py-1.5 border-b border-cream-200 last:border-0 ${typeColors[log.type]}`}
            >
              {log.message}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
