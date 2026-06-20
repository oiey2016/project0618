import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarRating } from './StarRating';
import { useGameStore } from '@/store/gameStore';
import { LEVELS } from '@/data/levels';
import { useNavigate } from 'react-router-dom';
import { Home, RotateCcw, ChevronRight, PartyPopper, CloudRain } from 'lucide-react';
import { StarsCount } from '@/types';

interface ResultModalProps {
  visible: boolean;
  result: 'success' | 'fail' | null;
  stars: StarsCount;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  rotate: number;
}

export const ResultModal: React.FC<ResultModalProps> = ({ visible, result, stars }) => {
  const navigate = useNavigate();
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const unlockNextLevel = useGameStore(s => s.unlockNextLevel);
  const resetLevelState = useGameStore(s => s.resetLevelState);
  const setGameResult = useGameStore(s => s.setGameResult);
  const setCurrentLevel = useGameStore(s => s.setCurrentLevel);

  const level = currentLevelId ? LEVELS.find(l => l.id === currentLevelId) : null;
  const nextLevel = currentLevelId ? LEVELS.find(l => l.id === currentLevelId + 1) : null;
  const isLastLevel = !nextLevel;

  const confetti = useMemo<ConfettiParticle[]>(() => {
    if (result !== 'success') return [];
    const colors = ['#FF9A78', '#FFD466', '#B8E0C4', '#A8D8EA', '#D4C5E8', '#FF8FB1'];
    const arr: ConfettiParticle[] = [];
    for (let i = 0; i < 60; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -20 - 10,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 10,
        delay: Math.random() * 0.5,
        rotate: Math.random() * 720 - 360,
      });
    }
    return arr;
  }, [result]);

  const handleRetry = () => {
    resetLevelState();
    setGameResult(null);
    if ((window as any).__resetGameSim) (window as any).__resetGameSim();
  };

  const handleNext = () => {
    if (result === 'success' && currentLevelId != null) {
      unlockNextLevel(currentLevelId, stars);
    }
    setGameResult(null);
    if (nextLevel) {
      setCurrentLevel(nextLevel.id);
      navigate(`/game/${nextLevel.id}`);
    } else {
      navigate('/levels');
    }
  };

  const handleHome = () => {
    if (result === 'success' && currentLevelId != null) {
      unlockNextLevel(currentLevelId, stars);
    }
    setGameResult(null);
    navigate('/levels');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-cocoa-soft/30 backdrop-blur-sm"
            onClick={handleHome}
          />

          {result === 'success' && confetti.map(p => (
            <motion.div
              key={p.id}
              initial={{ top: `${p.y}%`, left: `${p.x}%`, opacity: 0, rotate: 0 }}
              animate={{
                top: '120%',
                opacity: [0, 1, 1, 0],
                rotate: p.rotate,
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: p.delay,
                ease: 'easeOut',
              }}
              className="absolute z-40 rounded-sm"
              style={{
                width: p.size,
                height: p.size * 0.5,
                background: p.color,
                borderRadius: Math.random() > 0.5 ? '2px' : '50%',
              }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
            className="relative z-50 w-full max-w-md"
          >
            <div className="card-float p-8 text-center relative overflow-hidden">
              {result === 'success' && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-sunny-light/50 to-transparent pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-sunny-soft to-sunny-gold flex items-center justify-center shadow-pop border-4 border-white"
                  >
                    <PartyPopper size={48} className="text-white" strokeWidth={2.5} />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-cute text-4xl title-cute mb-2"
                  >
                    太棒啦！
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-cocoa-light mb-6"
                  >
                    第{currentLevelId}关 · {level?.name} 通关成功！
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 py-4"
                  >
                    <StarRating stars={stars} size="lg" />
                    <div className="mt-3 text-sm text-cocoa-light/70 font-cute">
                      {stars === 3 && '🌟 完美通关！你是小天才！'}
                      {stars === 2 && '✨ 干得漂亮！可以更省积木哦～'}
                      {stars === 1 && '👍 成功过关！试试用更少的积木？'}
                    </div>
                  </motion.div>
                </>
              )}

              {result === 'fail' && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-sky-light/40 to-transparent pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-sky-light to-sky-soft flex items-center justify-center shadow-pop border-4 border-white animate-bounce-soft"
                  >
                    <CloudRain size={48} className="text-white" strokeWidth={2.5} />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-cute text-4xl text-cocoa-soft mb-2"
                  >
                    哎呀～
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-cocoa-light mb-6 leading-relaxed"
                  >
                    团子摔倒了呢 <span className="animate-wiggle inline-block">😭</span><br />
                    <span className="text-peach-500 font-cute">没关系，再试一次吧！</span>
                  </motion.p>

                  <div className="mb-6 py-2">
                    <div className="text-6xl animate-bounce-soft">🍡</div>
                  </div>
                </>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-3"
              >
                {result === 'success' && !isLastLevel && (
                  <button onClick={handleNext} className="btn-cute-primary w-full">
                    <span>下一关</span>
                    <ChevronRight size={24} />
                  </button>
                )}
                {result === 'success' && isLastLevel && (
                  <button onClick={handleHome} className="btn-cute-primary w-full">
                    <PartyPopper size={22} />
                    <span>全部通关！返回选关</span>
                  </button>
                )}

                <button onClick={handleRetry} className="btn-cute w-full">
                  <RotateCcw size={22} />
                  <span>{result === 'success' ? '再玩一次' : '重新挑战'}</span>
                </button>

                <button onClick={handleHome} className="btn-cute-ghost w-full">
                  <Home size={20} />
                  <span>关卡选择</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
