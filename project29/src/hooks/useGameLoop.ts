import { useEffect, useRef } from 'react';
import { useGameStore, selectPhase, selectActions } from '../store/useGameStore';

export const useGameLoop = () => {
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const phase = useGameStore(selectPhase);
  const { update } = useGameStore(selectActions);

  useEffect(() => {
    const loop = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      update(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [update]);

  return { isRunning: phase === 'playing' || phase === 'countdown' || phase === 'roundEnd' };
};
