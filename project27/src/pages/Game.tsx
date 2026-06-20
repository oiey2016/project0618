import { useEffect, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GameCanvas } from '../components/GameCanvas';
import { HealthBar } from '../components/HealthBar';
import { MenuScreen } from '../components/MenuScreen';
import { ResultScreen } from '../components/ResultScreen';
import type { Player } from '../game/types';

export default function GamePage() {
  const [game, setGame] = useState<GameEngine | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing' | 'result'>('menu');
  const [winnerId, setWinnerId] = useState<number | null>(null);

  useEffect(() => {
    const gameInstance = new GameEngine();
    gameInstance.init();
    setGame(gameInstance);

    const removeListener = gameInstance.addUpdateListener(() => {
      setPlayers([...gameInstance.players]);
      setGameState(gameInstance.state);
      setWinnerId(gameInstance.winnerId);
    });

    return () => {
      removeListener();
      gameInstance.destroy();
    };
  }, []);

  const handleStart = (playerCount: number) => {
    if (!game) return;
    game.setPlayerCount(playerCount);
    game.startGame();
  };

  const handleRestart = () => {
    if (!game) return;
    game.startGame();
  };

  const handleMenu = () => {
    if (!game) return;
    game.returnToMenu();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      <div
        className="relative"
        style={{
          width: '100%',
          maxWidth: '1280px',
          aspectRatio: '16 / 9',
          maxHeight: '100vh',
        }}
      >
        {game && <GameCanvas game={game} />}

        {game && gameState !== 'menu' && gameState !== 'result' && (
          <HealthBar players={players} />
        )}

        {gameState === 'menu' && <MenuScreen onStart={handleStart} />}

        {gameState === 'result' && (
          <ResultScreen
            winnerId={winnerId}
            onRestart={handleRestart}
            onMenu={handleMenu}
          />
        )}

        {gameState === 'playing' && (
          <button
            onClick={handleMenu}
            className="absolute top-4 right-4 z-10 px-4 py-2 text-xs text-gray-400 hover:text-white bg-black/30 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            ESC 退出
          </button>
        )}
      </div>
    </div>
  );
}
