import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import GameCanvas from '../components/game/GameCanvas';
import GameHUD from '../components/game/GameHUD';
import Inventory from '../components/game/Inventory';
import DialogBox from '../components/game/DialogBox';
import PuzzleModal from '../components/game/PuzzleModal';
import GameInstructions from '../components/game/GameInstructions';
import MainMenu from '../components/menus/MainMenu';
import PauseMenu from '../components/menus/PauseMenu';
import EndScreen from '../components/menus/EndScreen';

export default function GamePage() {
  const gameState = useGameStore((s) => s.gameState);
  const showGameInstructions = useGameStore((s) => s.showGameInstructions);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      
      if (e.key === 'Escape') {
        if (state.showGameInstructions) {
          state.closeGameInstructions();
          return;
        }
        if (gameState === 'playing') {
          state.pauseGame();
        } else if (gameState === 'paused') {
          state.resumeGame();
        } else if (gameState === 'dialog') {
          state.hideDialog();
        } else if (gameState === 'puzzle') {
          state.closePuzzle();
        }
      }
      
      if (e.key === 'h' || e.key === 'H') {
        if (gameState === 'playing' || gameState === 'paused') {
          state.toggleHint();
        }
      }

      if (e.key === '?' || e.key === '/') {
        if (gameState === 'playing' || gameState === 'paused') {
          if (state.showGameInstructions) {
            state.closeGameInstructions();
          } else {
            state.openGameInstructions();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showGameInstructions]);

  const showGame = gameState !== 'menu' && gameState !== 'instructions';

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(180deg, #1a1520 0%, #2d2540 50%, #1a1520 100%)',
      }}
    >
      {showGame && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <GameHUD />
          <GameCanvas />
          <Inventory />
        </div>
      )}

      <MainMenu />
      <PauseMenu />
      <DialogBox />
      <PuzzleModal />
      <GameInstructions />
      <EndScreen />
    </div>
  );
}
