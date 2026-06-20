import React, { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import EndScreen from './EndScreen';
import { useGameStore } from '../game/store';
import { MAP_WIDTH, MAP_HEIGHT } from '../game/constants';

const GameScreen: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const isChasing = useGameStore((state) => state.isChasing);
  const [canvasSize, setCanvasSize] = useState({ width: MAP_WIDTH, height: MAP_HEIGHT });

  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 48, MAP_WIDTH);
      const maxHeight = Math.min(window.innerHeight - 48, MAP_HEIGHT);
      const scale = Math.min(maxWidth / MAP_WIDTH, maxHeight / MAP_HEIGHT);
      setCanvasSize({
        width: Math.floor(MAP_WIDTH * scale),
        height: Math.floor(MAP_HEIGHT * scale),
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const showEndScreen = phase === 'won' || phase === 'lost';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark-bg overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ice-pink/10 via-transparent to-neon-purple/10" />
      </div>

      <div
        className={`crt-effect vignette absolute inset-0 pointer-events-none z-40 ${
          isChasing ? 'danger-vignette' : ''
        }`}
      />

      <div className="relative z-10">
        <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-ice-pink/30">
          <GameCanvas width={canvasSize.width} height={canvasSize.height} />
        </div>
      </div>

      <HUD />

      {showEndScreen && <EndScreen />}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <h1 className="font-creepster text-3xl text-ice-pink text-shadow-neon-pink opacity-80">
          🍦 诡异冰淇淋车 🍦
        </h1>
      </div>
    </div>
  );
};

export default GameScreen;
