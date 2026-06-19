import { useMemo } from 'react';
import { X, Lock, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { SPECIES, EVOLUTION_STAGES, getGlowClass } from '@/data/evolutionTree';
import type { Rarity } from '@/types';

interface CodexPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const rarityColors: Record<Rarity, string> = {
  common: 'text-life-400',
  rare: 'text-ocean-400',
  legendary: 'text-divine-400',
};

const rarityBgColors: Record<Rarity, string> = {
  common: 'bg-life-500/10 border-life-500/20',
  rare: 'bg-ocean-500/10 border-ocean-500/20',
  legendary: 'bg-divine-500/10 border-divine-500/30',
};

const rarityLabels: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  legendary: '传说',
};

export default function CodexPanel({ isOpen, onClose }: CodexPanelProps) {
  const { unlockedSpecies, highestLevel } = useGameStore();

  const speciesByStage = useMemo(() => {
    const groups: Record<number, typeof SPECIES> = {};
    SPECIES.forEach(species => {
      if (!groups[species.stage]) {
        groups[species.stage] = [];
      }
      groups[species.stage].push(species);
    });
    return groups;
  }, []);

  const unlockedCount = unlockedSpecies.length;
  const totalCount = SPECIES.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 glass-panel rounded-l-3xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-divine-400 flex items-center gap-2">
                  <Sparkles size={24} />
                  进化图鉴
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  已解锁 {unlockedCount}/{totalCount} ({progress}%)
                </p>
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-life-500 via-divine-400 to-nebula-500"
                  />
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white/70" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {EVOLUTION_STAGES.map((stage, stageIndex) => {
                const stageSpecies = speciesByStage[stage.id] || [];
                const stageUnlocked = stageSpecies.some(s => unlockedSpecies.includes(s.level));
                const isStageReached = highestLevel >= stage.unlockLevel;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stageIndex * 0.1 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${isStageReached ? 'bg-divine-500/30 text-divine-400' : 'bg-white/10 text-white/30'}
                      `}>
                        {isStageReached ? (
                          <Sparkles size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-display text-lg
                          ${isStageReached ? 'text-white' : 'text-white/40'}
                        `}>
                          {stage.id}. {stage.name}
                        </h3>
                        <p className={`text-xs
                          ${isStageReached ? 'text-white/50' : 'text-white/30'}
                        `}>
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pl-10">
                      {stageSpecies.map((species, speciesIndex) => {
                        const isUnlocked = unlockedSpecies.includes(species.level);
                        
                        return (
                          <motion.div
                            key={species.level}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: stageIndex * 0.1 + speciesIndex * 0.05 }}
                            className={`p-3 rounded-xl border-2 transition-all
                              ${isUnlocked 
                                ? `${rarityBgColors[species.rarity]} ${getGlowClass(species.rarity)}` 
                                : 'bg-white/5 border-white/10 opacity-50'
                              }
                            `}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-1">
                                {isUnlocked ? species.emoji : '❓'}
                              </div>
                              <div className={`text-xs font-medium truncate
                                ${isUnlocked ? rarityColors[species.rarity] : 'text-white/30'}
                              `}>
                                {isUnlocked ? species.name : '???'}
                              </div>
                              {isUnlocked && (
                                <div className={`text-[10px] mt-0.5 px-1.5 py-0.5 rounded-full inline-block
                                  ${species.rarity === 'legendary' ? 'bg-divine-400/20 text-divine-300' : ''}
                                  ${species.rarity === 'rare' ? 'bg-ocean-400/20 text-ocean-300' : ''}
                                  ${species.rarity === 'common' ? 'bg-life-400/20 text-life-300' : ''}
                                `}>
                                  {rarityLabels[species.rarity]}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/10 text-center text-white/40 text-xs">
              两个相同的生命合成更高级的生命 · 5% 概率触发奇迹进化
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
