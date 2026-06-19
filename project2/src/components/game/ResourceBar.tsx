import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { formatGold, formatPerSecond } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';

export const ResourceBar = () => {
  const gold = useGameStore((state) => state.gold);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const gameSpeed = useGameStore((state) => state.gameSpeed);
  const getGoldPerSecond = useGameStore((state) => state.getGoldPerSecond);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const setGameSpeed = useGameStore((state) => state.setGameSpeed);
  const resetGame = useGameStore((state) => state.resetGame);
  const totalEarnings = useGameStore((state) => state.totalEarnings);

  const goldPerSecond = getGoldPerSecond();

  const handleReset = () => {
    if (window.confirm('确定要重置游戏吗？所有进度将丢失！')) {
      resetGame();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-b-2 border-amber-600 shadow-2xl"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">⛏️</span>
            <h1 className="text-xl font-bold text-amber-400 hidden sm:block" style={{ fontFamily: 'monospace' }}>
              采矿大亨
            </h1>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-center">
            <motion.div
              key={gold}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Coins className="w-6 h-6 text-yellow-400" />
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400" style={{ fontFamily: 'monospace' }}>
                  {formatGold(gold).replace('💰 ', '')}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={goldPerSecond}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-green-400 flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    {formatPerSecond(goldPerSecond)}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="hidden md:block text-center">
              <p className="text-xs text-stone-500">总收入</p>
              <p className="text-sm text-stone-300 font-mono">{formatGold(totalEarnings)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-stone-800 rounded-lg p-1">
              {[1, 2, 3].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setGameSpeed(speed)}
                  className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                    gameSpeed === speed
                      ? 'bg-amber-500 text-white'
                      : 'text-stone-400 hover:text-white hover:bg-stone-700'
                  }`}
                >
                  {speed}×
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="p-2"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="p-2 text-red-400 hover:text-red-300"
              title="重置游戏"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
