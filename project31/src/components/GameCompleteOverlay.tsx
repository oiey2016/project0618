import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Sparkles, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function GameCompleteOverlay() {
  const { gameCompleted, totalAnswered, totalCorrect, eras, resetGame } = useGameStore();
  const totalLandmarks = eras.reduce((sum, era) => sum + era.landmarks.length, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <AnimatePresence>
      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        >
          {/* 背景粒子 */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: '50%',
                  y: '100%',
                  opacity: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${-20 - Math.random() * 30}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeOut',
                }}
              >
                <Sparkles
                  className="w-4 h-4 md:w-6 md:h-6"
                  style={{
                    color: ['#FFD700', '#FF69B4', '#00FFFF', '#7FFF00'][i % 4],
                  }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="relative max-w-2xl w-full"
          >
            <div
              className="absolute inset-0 rounded-3xl blur-3xl opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF69B4, #00FFFF)',
              }}
            />

            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-amber-300 via-pink-400 to-cyan-300">
              <div className="rounded-[22px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 md:p-12 text-center">
                {/* 奖杯 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.4 }}
                  className="relative inline-block mb-6"
                >
                  <div className="absolute inset-0 blur-2xl bg-amber-400/50 rounded-full" />
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center shadow-2xl">
                    <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: Math.cos((i / 6) * Math.PI * 2) * 70,
                        y: Math.sin((i / 6) * Math.PI * 2) * 70,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-300 fill-amber-300" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-display text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-3"
                >
                  文明史诗完成！
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-body text-base md:text-xl text-white/70 italic mb-8 max-w-md mx-auto"
                >
                  "从钻木取火到戴森球矩阵，你见证了人类文明的全部壮丽征程。"
                </motion.p>

                {/* 统计数据 */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-3 gap-3 md:gap-6 mb-8"
                >
                  <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/30">
                    <p className="font-display text-2xl md:text-4xl font-black text-cyan-300 mb-1">
                      {totalLandmarks}
                    </p>
                    <p className="font-body text-xs md:text-sm text-cyan-300/60">地标建筑</p>
                  </div>
                  <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-400/30">
                    <p className="font-display text-2xl md:text-4xl font-black text-amber-300 mb-1">
                      {totalAnswered}
                    </p>
                    <p className="font-body text-xs md:text-sm text-amber-300/60">答题总数</p>
                  </div>
                  <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-400/30">
                    <p className="font-display text-2xl md:text-4xl font-black text-purple-300 mb-1">
                      {accuracy}%
                    </p>
                    <p className="font-body text-xs md:text-sm text-purple-300/60">正确率</p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-8 py-4 rounded-2xl font-display font-bold text-white text-base md:text-lg flex items-center justify-center gap-3 mx-auto shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF69B4)',
                  }}
                >
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                  再次开启征程
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
