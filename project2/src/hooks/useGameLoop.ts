import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';

export const useGameLoop = () => {
  const lastTimeRef = useRef<number>(Date.now());
  const accumulatorRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  const gameLoop = useGameStore((state) => state.gameLoop);
  const gameSpeed = useGameStore((state) => state.gameSpeed);

  useEffect(() => {
    const TICK_RATE = 100;

    const update = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      accumulatorRef.current += deltaTime * gameSpeed;

      while (accumulatorRef.current >= TICK_RATE / 1000) {
        gameLoop(TICK_RATE / 1000);
        accumulatorRef.current -= TICK_RATE / 1000;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameSpeed]);
};
