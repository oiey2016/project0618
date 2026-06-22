import { useState, useCallback } from 'react';
import Menu from '@/components/Menu/Menu';
import GameScreen from '@/components/Game/GameScreen';
import ResultScreen from '@/components/Result/ResultScreen';
import SettingsScreen from '@/components/Settings/SettingsScreen';
import { useGameStore } from '@/store/gameStore';
import { demoSong } from '@/data/songs';

type Screen = 'menu' | 'game' | 'result' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const { resetGame, setSong } = useGameStore();

  const handleStart = useCallback(() => {
    setSong(demoSong);
    resetGame();
    setCurrentScreen('game');
  }, [setSong, resetGame]);

  const handleSettings = useCallback(() => {
    setCurrentScreen('settings');
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('menu');
  }, []);

  const handlePause = useCallback(() => {
  }, []);

  const handleGameEnd = useCallback(() => {
    setCurrentScreen('result');
  }, []);

  const handleRestart = useCallback(() => {
    resetGame();
    setSong(demoSong);
    setCurrentScreen('game');
  }, [resetGame, setSong]);

  const handleHome = useCallback(() => {
    resetGame();
    setCurrentScreen('menu');
  }, [resetGame]);

  return (
    <div className="w-full h-full bg-game-bg">
      {currentScreen === 'menu' && (
        <Menu onStart={handleStart} onSettings={handleSettings} />
      )}
      {currentScreen === 'game' && (
        <GameScreen onPause={handlePause} onEnd={handleGameEnd} />
      )}
      {currentScreen === 'result' && (
        <ResultScreen onRestart={handleRestart} onHome={handleHome} />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen onBack={handleBack} />
      )}
    </div>
  );
}
