import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../game/config';
import { formatNumber } from '../game/utils';

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Achievements = ({ isOpen, onClose }: AchievementsProps) => {
  const state = useGameStore((s) => s.state);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏆</span>
                <div>
                  <h2 className="text-2xl font-bold">成就系统</h2>
                  <p className="text-white/80 text-sm">
                    已解锁 {state.achievements.length} / {ACHIEVEMENTS.length} 个成就
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((achievement, index) => {
                const unlocked = state.achievements.includes(achievement.id);

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      unlocked
                        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-4xl ${
                          unlocked ? 'animate-bounce' : 'grayscale'
                        }`}
                        style={{ animationDuration: '3s' }}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-bold ${
                              unlocked ? 'text-amber-700' : 'text-gray-500'
                            }`}
                          >
                            {achievement.name}
                          </h3>
                          {unlocked && (
                            <span className="text-green-500 text-xl">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <span className="text-gray-400">奖励:</span>
                          <span className="text-amber-600 font-medium">
                            🥚 {formatNumber(achievement.reward)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
