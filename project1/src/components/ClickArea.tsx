import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getCurrentStage } from '../game/logic';
import { formatNumber } from '../game/utils';

interface FloatingEgg {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export const ClickArea = () => {
  const click = useGameStore((s) => s.click);
  const state = useGameStore((s) => s.state);
  const currentStage = getCurrentStage(state);
  const [isPressed, setIsPressed] = useState(false);
  const [floatingEggs, setFloatingEggs] = useState<FloatingEgg[]>([]);
  const nextIdRef = useRef(0);
  const areaRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      click();

      const rect = areaRef.current?.getBoundingClientRect();
      if (!rect) return;

      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newEgg: FloatingEgg = {
        id: nextIdRef.current++,
        x,
        y,
        amount: state.eggsPerClick,
      };

      setFloatingEggs((prev) => [...prev, newEgg]);

      setTimeout(() => {
        setFloatingEggs((prev) => prev.filter((e) => e.id !== newEgg.id));
      }, 1000);
    },
    [click, state.eggsPerClick]
  );

  useEffect(() => {
    if (floatingEggs.length > 20) {
      setFloatingEggs((prev) => prev.slice(-20));
    }
  }, [floatingEggs.length]);

  return (
    <div
      ref={areaRef}
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
      onTouchStart={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {state.currentStage >= 2 && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
      </div>

      <AnimatePresence>
        {floatingEggs.map((egg) => (
          <motion.div
            key={egg.id}
            className="absolute pointer-events-none text-lg font-bold text-amber-600 drop-shadow-lg z-20"
            style={{ left: egg.x, top: egg.y }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            +{formatNumber(egg.amount)} 🥚
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [-2, 0, 2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-[120px] md:text-[160px] drop-shadow-2xl cursor-pointer"
        >
          {currentStage.chickenEmoji}
        </motion.div>

        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 rounded-full blur-md"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <div className="mt-8 text-center">
        <p className="text-white/90 text-lg font-medium drop-shadow-lg">
          点击获得鸡蛋！
        </p>
        <p className="text-white/70 text-sm mt-1">
          每次点击 +{formatNumber(state.eggsPerClick)} 枚鸡蛋
        </p>
      </div>

      {state.currentStage >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full"
        >
          <div className="flex items-center gap-2 text-white">
            <span className="animate-pulse">⚡</span>
            <span className="font-medium">
              自动生产中：每秒 +{formatNumber(state.eggsPerSecond)} 枚
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
