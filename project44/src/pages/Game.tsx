import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { StatusBar } from '../components/StatusBar';
import { ResourcePanel } from '../components/ResourcePanel';
import { ShelterView } from '../components/ShelterView';
import { BottomNav } from '../components/BottomNav';
import { BuildPanel } from '../components/BuildPanel';
import { CraftPanel } from '../components/CraftPanel';
import { ExplorePanel } from '../components/ExplorePanel';
import { InventoryPanel } from '../components/InventoryPanel';
import { BattleScene } from '../components/BattleScene';
import { StartScreen, GameOverScreen } from '../components/GameScreens';
import { Notification } from '../components/Notification';
import { GameplayModal } from '../components/GameplayModal';

const Game = () => {
  const {
    gameStarted,
    gameOver,
    activePanel,
    setActivePanel,
    isUnderAttack,
    tick,
    phase,
  } = useGameStore();

  const lastTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (deltaTime < 0.5) {
        tick(deltaTime);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, tick]);

  const renderPanel = () => {
    switch (activePanel) {
      case 'build':
        return <BuildPanel onClose={() => setActivePanel('none')} />;
      case 'craft':
        return <CraftPanel onClose={() => setActivePanel('none')} />;
      case 'explore':
        return <ExplorePanel onClose={() => setActivePanel('none')} />;
      case 'inventory':
        return <InventoryPanel onClose={() => setActivePanel('none')} />;
      default:
        return null;
    }
  };

  if (!gameStarted) {
    return <StartScreen />;
  }

  if (gameOver) {
    return <GameOverScreen />;
  }

  const showPanel = activePanel !== 'none';

  return (
    <div className={`
      w-full h-full flex flex-col bg-wasteland-bg
      ${isUnderAttack ? 'animate-shake' : ''}
      ${phase === 'night' && !isUnderAttack ? 'brightness-90' : ''}
    `}>
      <Notification />
      <GameplayModal />

      {isUnderAttack && <BattleScene />}

      <StatusBar />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 p-3 border-r border-wasteland-border overflow-y-auto">
          <ResourcePanel />

          <div className="mt-3 card-wasteland p-3">
            <div className="text-sm font-bold text-rust-400 mb-2">💡 提示</div>
            <div className="text-xs text-wasteland-muted space-y-1">
              <p>• 白天探索收集资源</p>
              <p>• 建造建筑提升生存能力</p>
              <p>• 制作武器增强战斗力</p>
              <p>• 夜晚会有僵尸来袭</p>
              <p>• 别让饥饿和口渴归零</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative">
          <ShelterView />
        </div>

        {showPanel && (
          <div className="w-96 border-l border-wasteland-border bg-wasteland-surface/50">
            {renderPanel()}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Game;
