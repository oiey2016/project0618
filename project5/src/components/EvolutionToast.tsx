import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export default function EvolutionToast() {
  const toasts = useGameStore(state => state.toasts);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`glass-panel px-6 py-3 flex items-center gap-3
              ${toast.isMiracle ? 'border-divine-400/50 bg-divine-400/10' : ''}
            `}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <span className="text-3xl" style={{ animation: 'unlock 2.5s ease-out forwards' }}>
              {toast.emoji}
            </span>
            <span className={`font-medium text-lg
              ${toast.isMiracle ? 'text-divine-300 font-display' : 'text-white/90'}
            `}>
              {toast.message}
            </span>
            {toast.isMiracle && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-divine-400/30 text-divine-300 font-medium">
                奇迹！
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
