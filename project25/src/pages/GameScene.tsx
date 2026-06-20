import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { LEVELS } from '@/data/levels';
import { GameCanvas } from '@/components/GameCanvas';
import { BlockToolbox } from '@/components/BlockToolbox';
import { ControlPanel } from '@/components/ControlPanel';
import { ResultModal } from '@/components/ResultModal';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { StarsCount } from '@/types';

export const GameScene: React.FC = () => {
  const params = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const levelId = Number(params.levelId);
  const level = LEVELS.find(l => l.id === levelId);

  const [showHelp, setShowHelp] = useState(false);

  const setCurrentLevel = useGameStore(s => s.setCurrentLevel);
  const currentLevelId = useGameStore(s => s.currentLevelId);
  const gameResult = useGameStore(s => s.gameResult);
  const earnedStars = useGameStore(s => s.earnedStars);
  const setGameResult = useGameStore(s => s.setGameResult);
  const unlockNextLevel = useGameStore(s => s.unlockNextLevel);

  useEffect(() => {
    if (!level) {
      navigate('/levels');
      return;
    }
    if (currentLevelId !== levelId) {
      setCurrentLevel(levelId);
    }
  }, [levelId, level, currentLevelId, setCurrentLevel, navigate]);

  const handleResult = (result: 'success' | 'fail', stars: StarsCount) => {
    setGameResult(result, stars);
    if (result === 'success') {
      unlockNextLevel(levelId, stars);
    }
  };

  const handlePlay = () => {
    if ((window as any).__startGameSim) {
      (window as any).__startGameSim();
    }
  };

  const handlePause = () => {
    if ((window as any).__pauseGameSim) {
      (window as any).__pauseGameSim();
    }
  };

  const handleResume = () => {
    if ((window as any).__resumeGameSim) {
      (window as any).__resumeGameSim();
    }
  };

  const handleReset = () => {
    if ((window as any).__resetGameSim) {
      (window as any).__resetGameSim();
    }
    setTimeout(() => {
      if ((window as any).__startGameSim === undefined) return;
    }, 50);
  };

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-glass p-8 text-center">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="font-cute text-2xl text-cocoa-soft mb-2">关卡不存在</h2>
          <button onClick={() => navigate('/levels')} className="btn-cute mt-4">
            返回选关
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-4 px-4 overflow-hidden">
      <div className="absolute top-20 left-8 w-28 h-14 bg-white/70 rounded-full blur-sm opacity-60" />
      <div className="absolute top-40 right-20 w-36 h-18 bg-white/60 rounded-full blur-sm opacity-60" />
      <div className="absolute bottom-40 left-12 w-32 h-16 bg-white/50 rounded-full blur-sm" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="relative mb-4">
          <ControlPanel
            onHint={() => {
              const hintBtns = document.querySelectorAll('[title="提示"]');
              hintBtns.forEach(b => {
                const el = b as HTMLElement;
                el.style.animation = 'none';
                setTimeout(() => {
                  el.style.animation = '';
                }, 10);
              });
              alert(`💡 第${levelId}关小提示:\n\n${level.description}\n\n三星条件: 使用 ≤ ${level.threeStarBlocks} 块积木`);
            }}
            onHelp={() => setShowHelp(true)}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>

        <motion.div
          key={levelId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="mb-4"
        >
          <div className="card-glass px-5 py-3 mb-4 mx-auto max-w-[1100px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-cute text-lg text-peach-500">🎯 目标</span>
                </div>
                <p className="text-sm text-cocoa-light leading-relaxed">
                  {level.description}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4 text-xs font-cute">
                <div className="text-center">
                  <div className="text-sunny-gold text-lg">⭐×3</div>
                  <div className="text-cocoa-light/60">≤{level.threeStarBlocks}块</div>
                </div>
                <div className="text-center">
                  <div className="text-sunny-gold/80 text-lg">⭐×2</div>
                  <div className="text-cocoa-light/60">≤{level.twoStarBlocks}块</div>
                </div>
                <div className="text-center">
                  <div className="text-sunny-gold/60 text-lg">⭐×1</div>
                  <div className="text-cocoa-light/60">≤{level.oneStarBlocks}块</div>
                </div>
              </div>
            </div>
          </div>

          <GameCanvas onResult={handleResult} />
        </motion.div>

        <BlockToolbox />
      </div>

      <ResultModal
        visible={gameResult !== null}
        result={gameResult}
        stars={earnedStars}
      />

      <HowToPlayModal visible={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};
