import { motion, AnimatePresence } from 'framer-motion';
import { getOreById } from '@/data/ores';
import { formatNumber } from '@/utils/formatters';
import type { Particle } from '@/types/game';

interface OreParticleProps {
  particles: Particle[];
}

export const OreParticle = ({ particles }: OreParticleProps) => {
  return (
    <AnimatePresence>
      {particles.map((particle) => {
        const ore = getOreById(particle.oreId);
        if (!ore) return null;

        return (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 0.5,
            }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 100,
              y: particle.y - 100 - Math.random() * 50,
              opacity: 0,
              scale: 1.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute pointer-events-none flex flex-col items-center"
          >
            <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${ore.color})` }}>
              {ore.emoji}
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: ore.color, textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
            >
              +{formatNumber(particle.value)}
            </span>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};
