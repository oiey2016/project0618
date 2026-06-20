import React, { useEffect, useRef } from 'react';
import { GameLoop } from '../game/engine/GameLoop';
import { useGameStore } from '../game/store';
import { audioManager } from '../game/utils/audio';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const setInput = useGameStore((state) => state.setInput);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gameLoop = new GameLoop(canvas);
    gameLoopRef.current = gameLoop;
    gameLoop.start();

    const handleKeyDown = (e: KeyboardEvent) => {
      audioManager.init();
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setInput({ up: true });
          break;
        case 's':
        case 'arrowdown':
          setInput({ down: true });
          break;
        case 'a':
        case 'arrowleft':
          setInput({ left: true });
          break;
        case 'd':
        case 'arrowright':
          setInput({ right: true });
          break;
        case ' ':
          e.preventDefault();
          setInput({ action: true });
          break;
        case 'e':
          setInput({ action: true });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setInput({ up: false });
          break;
        case 's':
        case 'arrowdown':
          setInput({ down: false });
          break;
        case 'a':
        case 'arrowleft':
          setInput({ left: false });
          break;
        case 'd':
        case 'arrowright':
          setInput({ right: false });
          break;
        case ' ':
        case 'e':
          setInput({ action: false });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gameLoop.stop();
    };
  }, [setInput]);

  useEffect(() => {
    if (gameLoopRef.current) {
      gameLoopRef.current.resize(width, height);
    }
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block bg-dark-bg rounded-lg"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
