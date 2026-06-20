import { motion } from 'framer-motion';
import { Sparkles, Landmark, Award, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function ResourceBar() {
  const { knowledgePoints, totalAnswered, totalCorrect, eras, resetGame } = useGameStore();
  const totalLandmarks = eras.reduce((sum, era) => sum + era.landmarks.filter(l => l.built).length, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            文明史诗
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-cyan-300" />
            <span className="font-display font-bold text-cyan-100 text-sm md:text-base">
              <motion.span
                key={knowledgePoints}
                initial={{ scale: 1.3, color: '#67e8f9' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
              >
                {knowledgePoints}
              </motion.span>
              <span className="hidden md:inline text-xs text-cyan-300/70 ml-1">知识点</span>
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30"
          >
            <Landmark className="w-4 h-4 md:w-5 md:h-5 text-amber-300" />
            <span className="font-display font-bold text-amber-100 text-sm md:text-base">
              {totalLandmarks}
              <span className="hidden md:inline text-xs text-amber-300/70 ml-1">地标</span>
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30"
          >
            <Award className="w-5 h-5 text-purple-300" />
            <span className="font-display font-bold text-purple-100 text-base">
              {accuracy}%
              <span className="text-xs text-purple-300/70 ml-1">正确率</span>
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-400/30 transition-all group"
            title="重新开始"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-red-300 transition-colors" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
