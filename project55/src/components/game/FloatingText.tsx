import { motion, AnimatePresence } from 'framer-motion';
import type { FloatingText as FloatingTextType } from '../../types/game';

interface FloatingTextProps {
  text: FloatingTextType;
}

export function FloatingTextComponent({ text }: FloatingTextProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${text.x}%`,
        top: `${text.y}%`,
      }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, scale: 1.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <span className="flex items-center gap-1 font-mono font-bold text-yellow-500 text-lg"
        style={{
          textShadow: '0 0 8px rgba(234, 179, 8, 0.8), 0 2px 4px rgba(0,0,0,0.4)'
        }}
      >
        {text.icon && <span>{text.icon}</span>}
        {text.text}
      </span>
    </motion.div>
  );
}

interface FloatingTextsProps {
  texts: FloatingTextType[];
}

export function FloatingTexts({ texts }: FloatingTextsProps) {
  return (
    <AnimatePresence>
      {texts.map((text) => (
        <FloatingTextComponent key={text.id} text={text} />
      ))}
    </AnimatePresence>
  );
}
