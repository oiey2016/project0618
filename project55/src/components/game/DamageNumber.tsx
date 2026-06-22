import { motion, AnimatePresence } from 'framer-motion';
import type { DamageNumber as DamageNumberType } from '../../types/game';

interface DamageNumberProps {
  damage: DamageNumberType;
}

export function DamageNumberComponent({ damage }: DamageNumberProps) {
  return (
    <motion.div
      className="absolute pointer-events-none font-mono font-bold z-20"
      style={{
        left: `${damage.x}%`,
        top: `${damage.y}%`,
      }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: 0, 
        y: -60, 
        scale: damage.isCrit ? 1.5 : 1.2 
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <span
        className={`text-shadow-soft ${
          damage.isCrit
            ? 'text-2xl text-red-500'
            : damage.target === 'player'
            ? 'text-xl text-orange-500'
            : 'text-xl text-white'
        }`}
        style={{
          textShadow: damage.isCrit 
            ? '0 0 10px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0,0,0,0.5)'
            : damage.target === 'player'
            ? '0 0 6px rgba(249, 115, 22, 0.8), 0 2px 4px rgba(0,0,0,0.5)'
            : '0 0 6px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {damage.isCrit && '💥'}
        -{damage.value}
      </span>
    </motion.div>
  );
}

interface DamageNumbersProps {
  damages: DamageNumberType[];
}

export function DamageNumbers({ damages }: DamageNumbersProps) {
  return (
    <AnimatePresence>
      {damages.map((dmg) => (
        <DamageNumberComponent key={dmg.id} damage={dmg} />
      ))}
    </AnimatePresence>
  );
}
