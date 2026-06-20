import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { CheckCircle, Lock } from 'lucide-react';

export function EraTimeline() {
  const { eras, currentEraId } = useGameStore();
  const currentEra = eras.find(e => e.id === currentEraId);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-16 left-0 right-0 z-30 px-4 py-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-1 md:gap-2">
          {eras.map((era, index) => {
            const isCurrent = era.id === currentEraId;
            const isPast = eras.findIndex(e => e.id === currentEraId) > index;
            const allBuilt = era.landmarks.every(l => l.built);

            return (
              <div key={era.id} className="flex-1 flex items-center">
                <motion.div
                  whileHover={era.unlocked ? { scale: 1.1, y: -4 } : {}}
                  className="relative flex flex-col items-center gap-1 md:gap-2 cursor-default group"
                >
                  <motion.div
                    className={`
                      relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl
                      transition-all duration-500
                      ${isCurrent ? 'ring-4 ring-white/40 shadow-lg shadow-white/20' : ''}
                      ${era.unlocked ? '' : 'grayscale opacity-50'}
                    `}
                    style={{
                      background: era.unlocked
                        ? `linear-gradient(135deg, ${era.theme.primary}, ${era.theme.secondary})`
                        : 'linear-gradient(135deg, #333, #222)',
                    }}
                    animate={isCurrent ? {
                      boxShadow: [
                        `0 0 20px ${era.theme.primary}`,
                        `0 0 40px ${era.theme.secondary}`,
                        `0 0 20px ${era.theme.primary}`,
                      ],
                    } : {}}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity },
                    }}
                  >
                    <span>{era.emoji}</span>
                    {allBuilt && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </motion.div>
                    )}
                    {!era.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                      </div>
                    )}
                  </motion.div>

                  <div className="text-center">
                    <p className={`
                      font-display font-bold text-xs md:text-sm whitespace-nowrap
                      ${isCurrent ? 'text-white' : 'text-white/50'}
                    `}>
                      {era.name}
                    </p>
                    <p className="text-[10px] md:text-xs text-white/30 hidden md:block">
                      {era.year}
                    </p>
                  </div>

                  {isCurrent && currentEra && (
                    <motion.div
                      layoutId="era-tooltip"
                      className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 md:w-64 p-3 md:p-4 rounded-xl backdrop-blur-xl border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${currentEra.theme.primary}20, ${currentEra.theme.secondary}20)`,
                        borderColor: `${currentEra.theme.primary}40`,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-body text-xs md:text-sm text-white/90 italic leading-relaxed">
                        "{currentEra.description}"
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {index < eras.length - 1 && (
                  <div className="flex-1 mx-0.5 md:mx-1 h-0.5 md:h-1 rounded-full overflow-hidden bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${era.theme.primary}, ${eras[index + 1].theme.primary})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: isPast ? '100%' : isCurrent ? '50%' : '0%' }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
