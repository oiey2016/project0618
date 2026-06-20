import { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GameRenderer } from '../game/GameRenderer';
import { GAME_CONFIG } from '../game/constants';

interface GameCanvasProps {
  game: GameEngine;
}

export function GameCanvas({ game }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = GAME_CONFIG.width;
    canvas.height = GAME_CONFIG.height;

    const renderer = new GameRenderer(canvas, game);
    rendererRef.current = renderer;

    const handleUpdate = () => {
      renderer.render();
    };

    const removeListener = game.addUpdateListener(handleUpdate);

    return () => {
      removeListener();
    };
  }, [game]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
