import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GAME_TICK, AUTO_SAVE_INTERVAL } from '../data/gameData';

export function useGameLoop() {
  const tick = useGameStore(state => state.tick);
  const save = useGameStore(state => state.save);
  const tickRef = useRef<number>();
  const saveRef = useRef<number>();

  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      tick();
    }, GAME_TICK);

    saveRef.current = window.setInterval(() => {
      save();
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (saveRef.current) clearInterval(saveRef.current);
    };
  }, [tick, save]);
}

export function useOfflineEarnings() {
  const claimOfflineEarnings = useGameStore(state => state.claimOfflineEarnings);
  const claimedRef = useRef(false);

  useEffect(() => {
    if (!claimedRef.current) {
      claimedRef.current = true;
      const earnings = claimOfflineEarnings();
      if (earnings > 0) {
        console.log(`离线收益: ${earnings} 金币`);
      }
    }
  }, [claimOfflineEarnings]);
}
