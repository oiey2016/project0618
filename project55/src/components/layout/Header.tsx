import { Coins, Gem } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { formatNumber } from '../../utils/formatter';
import { motion } from 'framer-motion';

export function Header() {
  const { gold, gems, player } = useGameStore();
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <div>
              <h1 className="font-display text-lg font-bold text-coffee-600 leading-tight">
                星落小镇
              </h1>
              <p className="text-xs text-coffee-400">Lv.{player.level} 冒险者</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-1 bg-cream-100 px-3 py-1.5 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-mono font-bold text-coffee-600 text-sm">
                {formatNumber(gold)}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1 bg-lavender-100 px-3 py-1.5 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Gem className="w-4 h-4 text-lavender-500" />
              <span className="font-mono font-bold text-coffee-600 text-sm">
                {formatNumber(gems)}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
