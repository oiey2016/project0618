import { motion } from 'framer-motion';
import { Sparkles, Hammer, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Era } from '../types/game';
import * as LucideIcons from 'lucide-react';

interface BuildPanelProps {
  era: Era;
  onStartQuiz: () => void;
}

export function BuildPanel({ era, onStartQuiz }: BuildPanelProps) {
  const { knowledgePoints, buildLandmark } = useGameStore();

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = LucideIcons;
    const IconComponent = icons[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ] || LucideIcons.Building2;
    return IconComponent;
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      className="fixed right-4 md:right-6 top-32 md:top-36 bottom-4 md:bottom-6 w-72 md:w-80 z-20"
    >
      <div
        className="h-full rounded-2xl p-0.5 backdrop-blur-xl overflow-hidden flex flex-col"
        style={{
          background: `linear-gradient(135deg, ${era.theme.primary}40, ${era.theme.secondary}20, transparent)`,
          border: `1px solid ${era.theme.primary}30`,
        }}
      >
        <div className="h-full rounded-xl bg-slate-950/80 flex flex-col overflow-hidden">
          <div className="p-4 md:p-5 border-b border-white/10">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg md:text-xl font-bold text-white">
                {era.emoji} {era.name}
              </h2>
            </div>
            <p className="font-body text-xs md:text-sm text-white/50 italic">
              建造地标，推进文明
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
            {era.landmarks.map((landmark, index) => {
              const IconComponent = getIcon(landmark.svgIcon);
              const canAfford = knowledgePoints >= landmark.cost;
              const isBuilt = landmark.built;

              return (
                <motion.div
                  key={landmark.id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`
                    relative p-3 md:p-4 rounded-xl border transition-all duration-300
                    ${isBuilt
                      ? 'bg-gradient-to-br from-green-500/15 to-emerald-500/5 border-green-500/30'
                      : canAfford
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }
                  `}
                  onClick={() => !isBuilt && canAfford && buildLandmark(landmark.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                        ${isBuilt ? '' : canAfford ? 'group-hover:scale-110' : ''}
                      `}
                      style={{
                        background: isBuilt
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : `linear-gradient(135deg, ${era.theme.primary}40, ${era.theme.secondary}20)`,
                        border: `1px solid ${isBuilt ? '#22c55e80' : era.theme.primary + '40'}`,
                      }}
                    >
                      {isBuilt ? (
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      ) : (
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6" style={{ color: era.theme.primary }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        font-display font-bold text-sm md:text-base mb-1
                        ${isBuilt ? 'text-green-300' : 'text-white'}
                      `}>
                        {landmark.name}
                      </h3>
                      <p className="font-body text-[11px] md:text-xs text-white/50 leading-relaxed mb-2">
                        {landmark.description}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {isBuilt ? (
                          <span className="font-display text-xs text-green-400 font-bold">
                            ✓ 已建造
                          </span>
                        ) : (
                          <>
                            <Sparkles className={`w-3 h-3 md:w-4 md:h-4 ${canAfford ? 'text-cyan-300' : 'text-white/30'}`} />
                            <span className={`
                              font-display text-xs md:text-sm font-bold
                              ${canAfford ? 'text-cyan-300' : 'text-white/30'}
                            `}>
                              {landmark.cost} 知识点
                            </span>
                            {!canAfford && (
                              <span className="text-[10px] md:text-xs text-white/30 ml-auto">
                                还差 {landmark.cost - knowledgePoints}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="p-3 md:p-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartQuiz}
              className="w-full py-3 md:py-3.5 rounded-xl font-display font-bold text-white flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${era.theme.primary}, ${era.theme.secondary})`,
                boxShadow: `0 8px 32px ${era.theme.primary}40`,
              }}
            >
              <Hammer className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">答题获取知识点</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
