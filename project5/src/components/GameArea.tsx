import { useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import LifeElement from './LifeElement';
import ParticleEffect from './ParticleEffect';

interface GameAreaProps {
  onFirstInteraction?: () => void;
}

export default function GameArea({ onFirstInteraction }: GameAreaProps) {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { entities, spawnEntity, tryMerge, addParticles, isFirstPlay, completeFirstPlay } = useGameStore();
  const hasInteractedRef = useRef(false);

  const handleAreaClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedOnElement = entities.some(entity => {
      const dx = x - entity.x;
      const dy = y - entity.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 30;
    });

    if (clickedOnElement) return;

    spawnEntity(x, y);
    addParticles(x, y, '#10b981', 5);

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      onFirstInteraction?.();
      if (isFirstPlay) {
        completeFirstPlay();
      }
    }
  }, [entities, spawnEntity, addParticles, onFirstInteraction, isFirstPlay, completeFirstPlay]);

  const handleMergeReady = useCallback((entity1Id: string, entity2Id: string) => {
    tryMerge(entity1Id, entity2Id);
  }, [tryMerge]);

  const sortedEntities = [...entities].sort((a, b) => {
    if (a.isDragging) return 1;
    if (b.isDragging) return -1;
    return a.level - b.level;
  });

  return (
    <div
      ref={gameAreaRef}
      className="fixed inset-0 pt-20 cursor-pointer"
      onClick={handleAreaClick}
    >
      <div className="absolute inset-0 pt-20 pointer-events-none">
        {isFirstPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="text-6xl mb-4 animate-bounce">✨</div>
              <p className="text-white/60 text-lg font-display">
                点击屏幕，创造第一个生命
              </p>
              <p className="text-white/30 text-sm mt-2">
                拖拽相同的生命合成更高级的形态
              </p>
            </div>
          </div>
        )}
      </div>

      <ParticleEffect />

      {sortedEntities.map(entity => (
        <LifeElement
          key={entity.id}
          entity={entity}
          onMergeReady={handleMergeReady}
          gameAreaRef={gameAreaRef}
        />
      ))}

      {entities.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs pointer-events-none">
          点击生成 · 拖拽合成 · 见证进化
        </div>
      )}
    </div>
  );
}
