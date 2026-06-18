import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { formatNumber, formatNumberPrecise } from '../game/utils';
import { getCurrentStage, getNextStage } from '../game/logic';

export const TopBar = () => {
  const state = useGameStore((s) => s.state);
  const currentStage = getCurrentStage(state);
  const nextStage = getNextStage(state);

  const progress = nextStage
    ? Math.min(100, (state.totalEggs / nextStage.requiredEggs) * 100)
    : 100;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-white/90 backdrop-blur-md shadow-lg border-b border-amber-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-4xl"
          >
            {currentStage.chickenEmoji}
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              星际蛋工厂
            </h1>
            <p className="text-xs text-gray-500">{currentStage.name}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥚</span>
            <motion.span
              key={Math.floor(state.eggs)}
              initial={{ scale: 1.1, y: -5 }}
              animate={{ scale: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent tabular-nums"
            >
              {formatNumber(state.eggs)}
            </motion.span>
          </div>
          <div className="text-sm text-gray-500">
            每秒 <span className="font-semibold text-amber-600">+{formatNumberPrecise(state.eggsPerSecond)}</span>
          </div>
        </div>

        <div className="w-64">
          {nextStage ? (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">下一阶段</span>
                <span className="text-amber-600 font-medium">{nextStage.name}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formatNumber(state.totalEggs)} / {formatNumber(nextStage.requiredEggs)}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-lg">👑</span>
              <p className="text-sm font-bold text-purple-600">宇宙霸主</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
