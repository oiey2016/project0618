import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

interface OfflineRewards {
  showModal: boolean;
  rewards: { gold: number; exp: number; time: number };
  claimRewards: () => void;
  closeModal: () => void;
}

export function useOfflineRewards(): OfflineRewards {
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState({ gold: 0, exp: 0, time: 0 });
  
  const { calculateOfflineRewards, claimOfflineRewards, updateLastOnlineTime, loadGame } = useGameStore();
  
  useEffect(() => {
    const hasExistingSave = loadGame();
    
    if (hasExistingSave) {
      const offlineRewards = calculateOfflineRewards();
      if (offlineRewards.gold > 0 || offlineRewards.exp > 0) {
        setRewards(offlineRewards);
        setShowModal(true);
      }
    }
    
    updateLastOnlineTime();
    
    const handleBeforeUnload = () => {
      useGameStore.getState().updateLastOnlineTime();
      useGameStore.getState().saveGame();
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const offlineRewards = useGameStore.getState().calculateOfflineRewards();
        if (offlineRewards.gold > 0 || offlineRewards.exp > 0) {
          setRewards(offlineRewards);
          setShowModal(true);
        }
        useGameStore.getState().updateLastOnlineTime();
      } else {
        useGameStore.getState().updateLastOnlineTime();
        useGameStore.getState().saveGame();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const saveInterval = setInterval(() => {
      useGameStore.getState().saveGame();
    }, 30000);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(saveInterval);
    };
  }, [loadGame, calculateOfflineRewards, updateLastOnlineTime]);
  
  const claimRewards = () => {
    claimOfflineRewards();
    setShowModal(false);
  };
  
  const closeModal = () => {
    updateLastOnlineTime();
    setShowModal(false);
  };
  
  return {
    showModal,
    rewards,
    claimRewards,
    closeModal,
  };
}
