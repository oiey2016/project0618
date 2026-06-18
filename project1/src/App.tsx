import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './components/TopBar';
import { ClickArea } from './components/ClickArea';
import { UpgradePanel } from './components/UpgradePanel';
import { StatsPanel } from './components/StatsPanel';
import { BottomNav } from './components/BottomNav';
import { Notification } from './components/Notification';
import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { getCurrentStage } from './game/logic';

function App() {
  const state = useGameStore((s) => s.state);
  const loadGame = useGameStore((s) => s.loadGame);
  const [showIntro, setShowIntro] = useState(true);
  const currentStage = getCurrentStage(state);

  useGameLoop();

  useEffect(() => {
    loadGame();
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, [loadGame]);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentStage.bgGradient} transition-all duration-1000 relative overflow-hidden`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {state.currentStage === 0 && (
          <>
            <div className="absolute top-20 left-10 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '4s' }}>☁️</div>
            <div className="absolute top-32 right-20 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>☁️</div>
            <div className="absolute top-16 right-1/3 text-4xl opacity-25 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>☁️</div>
          </>
        )}
        {state.currentStage >= 3 && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-5, 0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-[120px] mb-6"
              >
                🐔
              </motion.div>
              <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-4">
                星际蛋工厂
              </h1>
              <p className="text-white/80 text-xl">从农场到宇宙的鸡蛋帝国</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TopBar />
      <Notification />

      <div className="flex h-screen pt-20 pb-20">
        <UpgradePanel />

        <div className="flex-1 relative">
          <ClickArea />
        </div>

        <StatsPanel />
      </div>

      <BottomNav onReset={handleReset} />
    </div>
  );
}

export default App;
