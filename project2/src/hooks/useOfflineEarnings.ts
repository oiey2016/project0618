import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

export const useOfflineEarnings = () => {
  const [showModal, setShowModal] = useState(false);
  const [earnings, setEarnings] = useState<{ gold: number; duration: number } | null>(null);

  const calculateOfflineEarnings = useGameStore((state) => state.calculateOfflineEarnings);
  const collectOfflineEarnings = useGameStore((state) => state.collectOfflineEarnings);
  const loadGameState = useGameStore((state) => state.loadGameState);

  useEffect(() => {
    loadGameState();

    const result = calculateOfflineEarnings();
    if (result && result.gold > 0) {
      setEarnings(result);
      setShowModal(true);
    }
  }, []);

  const handleCollect = () => {
    if (earnings) {
      collectOfflineEarnings(earnings.gold);
      setShowModal(false);
      setEarnings(null);
    }
  };

  return {
    showModal,
    earnings,
    handleCollect,
    closeModal: () => setShowModal(false),
  };
};
