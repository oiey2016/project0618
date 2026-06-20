import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Play, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { LEVELS } from '@/data/levels';
import { StarRating } from '@/components/StarRating';
import { StarsCount } from '@/types';

const levelThumbColors = [
  'from-peach-100 to-peach-200',
  'from-sky-light to-sky-soft',
  'from-mint-light to-mint-soft',
  'from-sunny-light to-sunny-soft',
  'from-lavender-light to-lavender-soft',
];

const levelEmojis = ['🌱', '🪜', '🎈', '⚖️', '🏆'];

export const LevelSelect: React.FC = () => {
  const navigate = useNavigate();
  const unlockedLevels = useGameStore(s => s.unlockedLevels);
  const levelStars = useGameStore(s => s.levelStars);
  const setCurrentLevel = useGameStore(s => s.setCurrentLevel);

  const totalStars = Object.values(levelStars).reduce((sum, s) => sum + (s as number), 0);
  const maxStars = LEVELS.length * 3;

  const handleSelectLevel = (id: number) => {
    if (!unlockedLevels.includes(id)) return;
    setCurrentLevel(id);
    navigate(`/game/${id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-8 px-6">
      <div className="absolute top-10 left-10 w-32 h-20 bg-white/80 rounded-full blur-sm opacity-70" />
      <div className="absolute top-32 right-16 w-40 h-24 bg-white/70 rounded-full blur-sm opacity-70" />
      <div className="absolute bottom-20 left-1/4 w-36 h-20 bg-white/60 rounded-full blur-sm" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button onClick={handleBack} className="btn-round">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>

          <div className="text-center">
            <h1 className="font-cute text-5xl title-cute mb-1">选择关卡</h1>
            <p className="text-cocoa-light/70 text-sm font-cute">一步步解锁，开启团子大冒险！</p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card-glass px-4 py-2 flex items-center gap-2"
          >
            <Trophy size={22} className="text-sunny-gold" />
            <span className="font-cute text-lg text-cocoa-soft">
              {totalStars} <span className="text-cocoa-light/50 text-sm">/ {maxStars}</span>
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 card-glass p-5"
        >
          <div className="flex items-center justify-between mb-2 text-xs font-cute text-cocoa-light">
            <span>总进度</span>
            <span>{Math.round((totalStars / maxStars) * 100)}%</span>
          </div>
          <div className="h-4 bg-cream-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalStars / maxStars) * 100}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-sunny-soft via-sunny-gold to-peach-400 rounded-full"
              style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6)' }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {LEVELS.map((level, idx) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const stars = (levelStars[level.id] || 0) as StarsCount;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 40, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    delay: idx * 0.08,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={isUnlocked ? { y: -10, scale: 1.03 } : {}}
                  whileTap={isUnlocked ? { scale: 0.97 } : {}}
                  onClick={() => handleSelectLevel(level.id)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    !isUnlocked ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="card-float p-5 h-full">
                    <div className={`relative aspect-[4/3] rounded-2xl bg-gradient-to-br ${levelThumbColors[idx % levelThumbColors.length]} mb-4 overflow-hidden border-2 border-white/70 shadow-inner`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                          animate={isUnlocked ? { y: [0, -6, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15 }}
                          className="text-7xl"
                          style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))' }}
                        >
                          {levelEmojis[idx % levelEmojis.length]}
                        </motion.span>
                      </div>

                      <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center font-cute text-xl text-cocoa-soft shadow-md border-2 border-white">
                        {level.id}
                      </div>

                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-cocoa-soft/40 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Lock size={30} className="text-cocoa-soft" strokeWidth={2.5} />
                          </div>
                        </div>
                      )}

                      {isUnlocked && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-mint-soft to-mint-light text-white flex items-center justify-center shadow-pop border-2 border-white"
                        >
                          <Play size={22} className="ml-0.5" fill="currentColor" />
                        </motion.button>
                      )}
                    </div>

                    <h3 className="font-cute text-2xl text-cocoa-soft mb-1">
                      {level.name}
                    </h3>
                    <p className="text-sm text-cocoa-light/70 mb-3 line-clamp-2 min-h-[40px]">
                      {level.description}
                    </p>

                    {isUnlocked ? (
                      <StarRating stars={stars} size="sm" animated={false} />
                    ) : (
                      <div className="h-5 text-xs text-cocoa-light/50 font-cute">
                        🔒 通关上一关后解锁
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <button onClick={handleBack} className="btn-cute-ghost">
            <ArrowLeft size={18} />
            <span>返回主菜单</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
